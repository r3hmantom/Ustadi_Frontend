import { NextResponse } from "next/server";
import { ApiResponse } from "@/db/types";

interface LogoutResponse {
  message: string;
}

export async function POST(): Promise<NextResponse> {
  try {
    // Create a response
    const response = NextResponse.json({
      success: true,
      data: { message: "Logged out successfully" },
    } as ApiResponse<LogoutResponse>);

    // Clear the auth token cookie
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Error in POST /logout:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
