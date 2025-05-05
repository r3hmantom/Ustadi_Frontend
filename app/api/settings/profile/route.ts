import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/db/utils";
import { getSession } from "@/app/api/auth/utils";

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
    const { email, full_name } = body;

    // Validation
    if (!email && !full_name) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No fields to update" },
        },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const queryParams: Record<string, unknown> = { studentId };

    if (email !== undefined) {
      // Check if email already exists for another user
      const checkEmailQuery = `
        SELECT student_id FROM Students 
        WHERE email = @email AND student_id != @studentId
      `;
      const emailCheck = await executeQuery(checkEmailQuery, {
        email,
        studentId,
      });

      if (emailCheck.success && emailCheck.data.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: { message: "Email already in use by another account" },
          },
          { status: 409 }
        );
      }

      updates.push("email = @email");
      queryParams.email = email;
    }

    if (full_name !== undefined) {
      updates.push("full_name = @fullName");
      queryParams.fullName = full_name;
    }

    // Execute update query
    const query = `
      UPDATE Students
      SET ${updates.join(", ")}
      OUTPUT INSERTED.student_id as studentId, INSERTED.email, INSERTED.full_name as fullName,
             INSERTED.last_login as lastLogin, INSERTED.is_active as isActive
      WHERE student_id = @studentId
    `;

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "User not found" },
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing PATCH /api/settings/profile:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
