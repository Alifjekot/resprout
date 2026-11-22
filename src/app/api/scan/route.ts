import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { HERO_MATERIALS } from '@/lib/seed';
import { Scan, MaterialCategory } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const preset = (formData.get('preset') as string | null)?.trim();
    const manualName = (formData.get('material_name') as string | null)?.trim();
    const userId = (formData.get('user_id') as string | null) || 'usr-demo-maker';

    let materialName = 'Coconut husk';
    let category: MaterialCategory = 'agri';
    let confidence = 0.92;
    let notes = 'Fibrous brown outer shell of coconut, high tensile strength and moisture retention.';
    let matchedMaterialId: string | undefined = 'mat-coconut-husk';

    // Check if preset or manual selection was passed
    const queryTarget = manualName || preset;
    if (queryTarget) {
      const match = store.findMaterialByName(queryTarget);
      if (match) {
        materialName = match.name;
        category = match.category;
        confidence = 0.95;
        notes = match.description;
        matchedMaterialId = match.id;
      } else {
        materialName = queryTarget;
        category = 'other';
        confidence = 0.88;
        notes = 'User confirmed material.';
      }
    } else if (file) {
      // If a file is uploaded:
      // In DEMO_MODE or without OpenAI key, infer from filename or hero defaults
      const filename = file.name.toLowerCase();
      if (filename.includes('coffee')) {
        const mat = store.findMaterialByName('coffee')!;
        materialName = mat.name;
        category = mat.category;
        confidence = 0.94;
        notes = mat.description;
        matchedMaterialId = mat.id;
      } else if (filename.includes('palm') || filename.includes('kernel')) {
        const mat = store.findMaterialByName('palm')!;
        materialName = mat.name;
        category = mat.category;
        confidence = 0.91;
        notes = mat.description;
        matchedMaterialId = mat.id;
      } else if (filename.includes('oil')) {
        const mat = store.findMaterialByName('oil')!;
        materialName = mat.name;
        category = mat.category;
        confidence = 0.93;
        notes = mat.description;
        matchedMaterialId = mat.id;
      } else if (filename.includes('fabric') || filename.includes('textile') || filename.includes('cloth')) {
        const mat = store.findMaterialByName('fabric')!;
        materialName = mat.name;
        category = mat.category;
        confidence = 0.90;
        notes = mat.description;
        matchedMaterialId = mat.id;
      } else {
        // Default to Coconut husk as specified in Section 8 Demo script
        const mat = store.findMaterialByName('coconut') || HERO_MATERIALS[0];
        materialName = mat.name;
        category = mat.category;
        confidence = 0.92;
        notes = mat.description;
        matchedMaterialId = mat.id;
      }
    }

    const scanRecord: Scan = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      materialName,
      category,
      confidence,
      materialId: matchedMaterialId,
      notes,
      createdAt: new Date().toISOString(),
    };

    store.addScan(scanRecord);

    return NextResponse.json({
      scan_id: scanRecord.id,
      material_name: scanRecord.materialName,
      category: scanRecord.category,
      confidence: scanRecord.confidence,
      notes: scanRecord.notes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to scan material. Please try again.' },
      { status: 500 }
    );
  }
}
