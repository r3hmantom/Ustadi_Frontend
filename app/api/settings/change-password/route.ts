import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/db/utils";
import { getSession } from "@/app/api/auth/utils";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const studentId = session.user.studentId;
    const body = await request.json();
    const { current_password, new_password } = body;

    // Validation
    if (!current_password || !new_password) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Current password and new password are required" },
        },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "New password must be at least 8 characters" },
        },
        { status: 400 }
      );
    }

    // Get current password hash from database
    const getCurrentPasswordQuery = `
      SELECT password FROM Students WHERE student_id = @studentId
    `;

    const currentPasswordResult = await executeQuery(getCurrentPasswordQuery, {
      studentId,
    });

    if (
      !currentPasswordResult.success ||
      currentPasswordResult.data.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "User not found" },
        },
        { status: 404 }
      );
    }

    // Verify current password matches
    const isPasswordValid = await bcrypt.compare(
      current_password,
      currentPasswordResult.data[0].password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Current password is incorrect" },
        },
        { status: 401 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update password in database
    const updateQuery = `
      UPDATE Students
      SET password = @password
      WHERE student_id = @studentId
    `;

    const result = await executeQuery(updateQuery, {
      studentId,
      password: hashedPassword,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: { message: "Password changed successfully" },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Failed to update password" },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      "Error processing PATCH /api/settings/change-password:",
      error
    );
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
