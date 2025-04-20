import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  const backendRes = await fetch(`${API_URL}/resumes/${params.id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': userId || '',
    },
  });
  const data = await backendRes.json();
  return new NextResponse(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // For download
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  const backendRes = await fetch(`${API_URL}/resumes/${params.id}/download`, {
    method: 'GET',
    headers: {
      'x-user-id': userId || '',
    },
  });
  const blob = await backendRes.blob();
  return new NextResponse(blob, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('Content-Type') || 'application/pdf',
      'Content-Disposition': backendRes.headers.get('Content-Disposition') || '',
    },
  });
}
