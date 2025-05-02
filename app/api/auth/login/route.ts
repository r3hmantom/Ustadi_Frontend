import { executeQuery } from "@/db/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Email and password are required" },
        },
        { status: 400 }
      );
    }

    // Find user by email
    const query = `
      SELECT student_id, email, password, full_name, is_active 
      FROM Students 
      WHERE email = @Email
    `;

    const result = await executeQuery(query, { Email: email });

    // Check if user exists and result is successful
    if (!result.success || result.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid credentials" },
        },
        { status: 401 }
      );
    }

    const user = result.data[0];

    // Check if account is active
    if (user.is_active === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Account has been deactivated" },
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid credentials" },
        },
        { status: 401 }
      );
    }

    // Update last login time
    const updateLoginQuery = `
      UPDATE Students 
      SET last_login = GETDATE() 
      WHERE student_id = @StudentId
    `;

    await executeQuery(updateLoginQuery, { StudentId: user.student_id });

    // Create JWT token
    const token = jwt.sign(
      {
        studentId: user.student_id,
        email: user.email,
        fullName: user.full_name,
      },
      process.env.JWT_SECRET || "fallback_secret_key_not_for_production",
      { expiresIn: "7d" }
    );

    // Remove password from user object before sending the response
    delete user.password;

    // Set the token as an HTTP-only cookie and send the response
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user,
          token,
        },
      },
      { status: 200 }
    );

    // Set the JWT token as a cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error in POST /login:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
