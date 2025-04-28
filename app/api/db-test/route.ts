import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const result = await testConnection();
    
    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        data: result.data
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}