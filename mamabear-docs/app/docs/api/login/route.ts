import { createSessionToken, DOCS_COOKIE_NAME } from '@/lib/docs-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    const expectedPassword = process.env.DOCS_PASSWORD;
    if (!expectedPassword || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Password salah. Silakan periksa kembali.' },
        { status: 401 },
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(DOCS_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses login.' },
      { status: 400 },
    );
  }
}

