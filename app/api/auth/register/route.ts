import { executeQuery } from "@/db/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.email || !body.password || !body.full_name) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing required fields" },
        },
        { status: 400 }
      );
    }

    const query = `
            INSERT INTO Students (email, password, full_name)
            VALUES (@Email, @Password, @FullName)
        `;

    const params = {
      Email: body.email,
      Password: body.password,
      FullName: body.full_name,
    };

    const result = await executeQuery(query, params);

    if (result.success) {
      return NextResponse.json(result);
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
