import { executeQuery } from "@/db/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    // Basic validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required fields" },
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const checkEmailQuery = `
      SELECT email FROM Students WHERE email = @Email
    `;

    const emailCheck = await executeQuery(checkEmailQuery, { Email: email });

    if (emailCheck.success && emailCheck.data.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Email already exists" },
        },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const query = `
      INSERT INTO Students (email, password, full_name, registration_date)
      VALUES (@Email, @Password, @FullName, GETDATE());
      
      SELECT student_id, email, full_name 
      FROM Students 
      WHERE email = @Email;
    `;

    const params = {
      Email: email,
      Password: hashedPassword,
      FullName: fullName,
    };

    const result = await executeQuery(query, params);

    if (result.success) {
      // Return user data (excluding password)
      return NextResponse.json(
        {
          success: true,
          data: result.data[0],
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /register:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
