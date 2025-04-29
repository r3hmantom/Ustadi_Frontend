import { NextResponse } from "next/server";
import { getConnection } from "@/db/db"; // Adjust the import path if necessary

export async function GET() {
  try {
    const request = await getConnection();
    // Optional: Perform a simple query to further test the connection
    await request.query("SELECT 1");
    console.log("Database connection test successful.");
    return NextResponse.json({ message: "Database connection successful!" });
  } catch (error) {
    console.error("Database connection test failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Database connection failed", error: errorMessage },
      { status: 500 }
    );
  }
}
