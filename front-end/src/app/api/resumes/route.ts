import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  const backendRes = await fetch(`${API_URL}/resumes`, {
    method: 'GET',
    headers: {
      'x-user-id': userId || '',
      'Content-Type': 'application/json',
    },
  });
  const data = await backendRes.json();
  return new NextResponse(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  const formData = await req.formData();
  const backendRes = await fetch(`${API_URL}/resumes/upload`, {
    method: 'POST',
    headers: {
      'x-user-id': userId || '',
    },
    body: formData,
  });
  const data = await backendRes.json();
  return new NextResponse(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
