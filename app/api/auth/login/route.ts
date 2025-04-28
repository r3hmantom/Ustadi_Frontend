import { NextRequest, NextResponse } from 'next/server';

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function GET(req: NextRequest) {
  return new NextResponse(JSON.stringify({ message: "Login route is not implemented yet." }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequestBody = await req.json();
    
    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Demo authentication - in a real app, you would verify credentials against a database
    // For demo purposes, any email with password "password123" will work
    if (body.password !== "password123") {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Mock successful authentication
    // In a real app, you would fetch the user from a database and generate a JWT
    const user = {
      id: "1",
      name: body.email.split('@')[0],
      email: body.email,
    };
    
    return NextResponse.json({ 
      message: "Login successful", 
      user 
    }, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}