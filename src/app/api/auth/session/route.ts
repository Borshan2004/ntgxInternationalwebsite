// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { AuthUser } from '@/types/auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionCookie = req.cookies.get('fedex_user_session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie)) as AuthUser;
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function POST(): Promise<NextResponse> {
  // Logout endpoint: Clears session cookie
  const response = NextResponse.json({ message: 'Signed out successfully' });
  response.cookies.delete('fedex_user_session');
  return response;
}
