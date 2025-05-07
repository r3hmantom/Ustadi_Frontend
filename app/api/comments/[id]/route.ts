import { NextResponse, NextRequest } from "next/server";
import { executeQuery } from "@/db/utils";

/**
 * DELETE /api/comments/{id}
 * Deletes a comment by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id, 10);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid comment ID" } },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM Comments
      OUTPUT DELETED.*
      WHERE comment_id = @commentId;
    `;
    const queryParams = { commentId };

    const result = await executeQuery(query, queryParams);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json(
        { success: true, data: result.data[0] },
        { status: 200 }
      );
    } else if (result.success && (!result.data || result.data.length === 0)) {
      return NextResponse.json(
        { success: false, error: { message: "Comment not found" } },
        { status: 404 }
      );
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing DELETE /api/comments/{id}:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
