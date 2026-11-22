import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { calculateStage } from '@/lib/scoring';
import { Pledge } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, email, quantity = 1, consent, honeypot } = body;

    // Basic spam bot honeypot protection
    if (honeypot) {
      return NextResponse.json({ error: 'Spam detected.' }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
    }

    const page = store.getPledgePageBySlug(slug);
    if (!page || !page.isPublished) {
      return NextResponse.json({ error: 'Pledge page is not active.' }, { status: 404 });
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // PDPA requirement: Consent MUST be true
    if (!consent) {
      return NextResponse.json(
        { error: 'You must agree to be contacted about this product (PDPA requirement).' },
        { status: 400 }
      );
    }

    const newPledge: Pledge = {
      id: `pledge-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pageId: page.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      quantity: Math.max(1, Number(quantity) || 1),
      consent: true,
      createdAt: new Date().toISOString(),
    };

    store.addPledge(newPledge);

    // Fetch updated pledges for this page
    const allPledges = store.getPledgesByPageId(page.id);
    const totalPledgesCount = allPledges.length;

    // Recalculate tree stage for associated idea
    if (page.ideaId) {
      const idea = store.getIdeaById(page.ideaId);
      if (idea) {
        const nextStage = calculateStage(
          idea.stage,
          idea.score,
          page.isPublished,
          totalPledgesCount,
          Number(process.env.PLEDGE_TARGET_TREE) || 10,
          Number(process.env.PLEDGE_TARGET_FOREST) || 50
        );

        if (nextStage !== idea.stage) {
          store.updateIdea(idea.id, { stage: nextStage });
        }
      }
    }

    return NextResponse.json({
      success: true,
      pledgeNumber: totalPledgesCount,
      message: `Thank you! You are pledge number ${totalPledgesCount}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit pledge.' },
      { status: 400 }
    );
  }
}
