import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { executeQuery } from "@/db/utils";
import { UserProfile, ApiResponse } from "@/db/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    // If no token, return unauthorized
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized" },
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret_key_not_for_production"
    );

    let payload;
    try {
      const { payload: jwtPayload } = await jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (error) {
      // Invalid token
      console.log(error);
      const response = NextResponse.json(
        {
          success: false,
          error: { message: "Invalid token" },
        } as ApiResponse<never>,
        { status: 401 }
      );

      // Clear the invalid token
      response.cookies.delete("auth_token");
      return response;
    }

    // Fetch latest user data from database
    const studentId = payload.studentId;
    const query = `
      SELECT student_id as studentId, email, full_name as fullName, last_login as lastLogin, is_active as isActive
      FROM Students
      WHERE student_id = @StudentId
    `;

    const result = await executeQuery<UserProfile>(query, {
      StudentId: studentId,
    });

    if (!result.success || result.data.length === 0) {
      const response = NextResponse.json(
        {
          success: false,
          error: { message: "User not found" },
        } as ApiResponse<never>,
        { status: 404 }
      );

      // Clear the token as user doesn't exist anymore
      response.cookies.delete("auth_token");
      return response;
    }

    // Return user data
    return NextResponse.json({
      success: true,
      data: result.data[0],
    } as ApiResponse<UserProfile>);
  } catch (error) {
    console.error("Error in GET /me:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
