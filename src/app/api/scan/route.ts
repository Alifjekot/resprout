import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { HERO_MATERIALS } from '@/lib/seed';
import { Scan, MaterialCategory } from '@/lib/types';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const VALID_CATEGORIES = new Set<MaterialCategory>(['agri', 'food', 'textile', 'oil', 'plastic', 'other']);

type Identification = {
  material_name: string;
  category: MaterialCategory;
  confidence: number;
  notes: string;
};

function demoIdentification(fileName = ''): Identification {
  const filename = fileName.toLowerCase();
  let material = HERO_MATERIALS.find((item) => item.id === 'mat-coconut-husk') || HERO_MATERIALS[0];

  if (filename.includes('coffee')) {
    material = HERO_MATERIALS.find((item) => item.id === 'mat-coffee-grounds') || material;
  } else if (filename.includes('palm') || filename.includes('kernel')) {
    material = HERO_MATERIALS.find((item) => item.id === 'mat-palm-kernel-shell') || material;
  } else if (filename.includes('oil')) {
    material = HERO_MATERIALS.find((item) => item.id === 'mat-used-cooking-oil') || material;
  } else if (filename.includes('fabric') || filename.includes('textile') || filename.includes('cloth')) {
    material = HERO_MATERIALS.find((item) => item.id === 'mat-fabric-scraps') || material;
  }

  return {
    material_name: material.name,
    category: material.category,
    confidence: 0.5,
    notes: `Demo catalogue result based on the filename or default material. This is not AI image recognition. ${material.description}`,
  };
}

async function identifyWithOpenAI(file: File, apiKey: string): Promise<Identification> {
  const imageBuffer = Buffer.from(await file.arrayBuffer());
  const imageDataUrl = `data:${file.type};base64,${imageBuffer.toString('base64')}`;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 350,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You identify waste materials from photographs for a Malaysian sustainability project.',
            'Return only a JSON object with keys material_name, category, confidence, notes.',
            'category must be one of: agri, food, textile, oil, plastic, other.',
            'confidence must be a number from 0 to 1 and is an approximate model estimate, not a calibrated probability.',
            'If the image is not clearly a waste material, use category other, confidence at most 0.3, and explain the uncertainty.',
            'Do not claim certainty when the image is ambiguous. Do not infer a material from its filename.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identify the main waste material visible in this image. Give a concise description of the visual evidence and any uncertainty.',
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl, detail: 'high' },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error?.message || `OpenAI request failed with status ${response.status}`;
    throw new Error(message);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('The AI service returned an empty identification result.');
  }

  let parsed: Partial<Identification>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('The AI service returned an unreadable result. Please try another photo.');
  }

  const materialName = typeof parsed.material_name === 'string' ? parsed.material_name.trim() : '';
  const category = parsed.category as MaterialCategory;
  const confidence = Number(parsed.confidence);
  const notes = typeof parsed.notes === 'string' ? parsed.notes.trim() : '';

  if (
    !materialName ||
    !VALID_CATEGORIES.has(category) ||
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 1
  ) {
    throw new Error('The AI service returned an invalid identification result.');
  }

  return {
    material_name: materialName,
    category,
    confidence,
    notes: notes || 'AI identified this material from the uploaded photograph.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileValue = formData.get('file');
    const file = fileValue instanceof File ? fileValue : null;
    const preset = (formData.get('preset') as string | null)?.trim();
    const manualName = (formData.get('material_name') as string | null)?.trim();
    const userId = (formData.get('user_id') as string | null) || 'usr-demo-maker';

    let result: Identification;
    let source: 'ai' | 'demo' = 'demo';
    let matchedMaterialId: string | undefined;

    const queryTarget = manualName || preset;
    if (queryTarget) {
      const match = store.findMaterialByName(queryTarget);
      result = match
        ? {
            material_name: match.name,
            category: match.category,
            confidence: 1,
            notes: match.description,
          }
        : {
            material_name: queryTarget,
            category: 'other',
            confidence: 1,
            notes: 'Material selected manually by the user.',
          };
      matchedMaterialId = match?.id;
    } else if (file) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: 'Unsupported image type. Please upload a JPG, PNG, WEBP or GIF image.' },
          { status: 400 }
        );
      }
      if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: 'Image must be smaller than 10 MB and cannot be empty.' },
          { status: 400 }
        );
      }

      const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
      const demoMode = process.env.DEMO_MODE === 'true';

      if (apiKey && !demoMode) {
        result = await identifyWithOpenAI(file, apiKey);
        source = 'ai';
      } else {
        result = demoIdentification(file.name);
      }
      const match = store.findMaterialByName(result.material_name);
      matchedMaterialId = match?.id;
    } else {
      return NextResponse.json(
        { error: 'Please upload an image or select a material from the catalogue.' },
        { status: 400 }
      );
    }

    const scanRecord: Scan = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      materialName: result.material_name,
      category: result.category,
      confidence: result.confidence,
      materialId: matchedMaterialId,
      notes: result.notes,
      createdAt: new Date().toISOString(),
    };

    store.addScan(scanRecord);

    return NextResponse.json({
      scan_id: scanRecord.id,
      material_name: scanRecord.materialName,
      category: scanRecord.category,
      confidence: scanRecord.confidence,
      notes: scanRecord.notes,
      source,
    });
  } catch (error) {
    console.error('Material scan failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to identify the material. Please try again.',
      },
      { status: 502 }
    );
  }
}
