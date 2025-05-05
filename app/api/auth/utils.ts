import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { executeQuery } from "@/db/utils";
import { UserProfile } from "@/db/types";

/**
 * Gets the current session from the auth token
 * @returns The user session or null if not authenticated
 */
export async function getSession(): Promise<{ user: UserProfile } | null> {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // If no token, not authenticated
    if (!token) {
      return null;
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
      console.log("Invalid token:", error);
      return null;
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
      return null;
    }

    // Return user data with session
    return {
      user: result.data[0],
    };
  } catch (error) {
    console.error("Error in getSession:", error);
    return null;
  }
}
