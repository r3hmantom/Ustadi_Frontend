import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log(request);
  try {
    // Create a response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the auth token cookie
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Error in POST /logout:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
