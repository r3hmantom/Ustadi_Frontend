import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return new NextResponse(JSON.stringify({ message: "Login route is not implemented yet." }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}