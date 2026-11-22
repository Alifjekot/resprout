import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const metrics = store.getAdminMetrics();
    const materials = store.getMaterials();

    return NextResponse.json({
      metrics,
      materials,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch admin metrics.' },
      { status: 500 }
    );
  }
}
