// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime?.() ?? 0,
    env: process.env.NODE_ENV,
  });
}
