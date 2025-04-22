import { NextRequest, NextResponse } from 'next/server';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();
    
    // Validate input
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Validate password strength (simple check)
    if (body.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    
    // Demo registration - in a real app, you would store the user in a database
    // Mock successful registration
    const user = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      name: body.name,
      email: body.email,
    };
    
    return NextResponse.json({ 
      message: "Registration successful", 
      user 
    }, { status: 201 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}