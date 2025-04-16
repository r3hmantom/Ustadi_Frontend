import { NextRequest, NextResponse } from "next/server";
import { executeQuery, withTransaction } from "@/lib/db";
import { Task } from "../route";
import sql from "mssql";

// GET a specific task by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }
    
    // Query to get task with its tags
    const query = `
      SELECT t.*, 
             STRING_AGG(tt.tag_name, ',') AS tags
      FROM Tasks t
      LEFT JOIN TaskTagMapping ttm ON t.task_id = ttm.task_id
      LEFT JOIN TaskTags tt ON ttm.tag_id = tt.tag_id
      WHERE t.task_id = @taskId
      GROUP BY t.task_id, t.student_id, t.title, t.description, 
               t.due_date, t.priority, t.recurrence_pattern, 
               t.parent_task_id, t.created_at, t.completed_at, t.is_recurring
    `;
    
    const tasks = await executeQuery<Task>(query, { taskId });
    
    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }
    
    const task = tasks[0];
    
    // Process tags
    const processedTask = {
      ...task,
      tags: task.tags ? task.tags.split(',') : []
    };
    
    // Get subtasks if any
    const subtasksQuery = `
      SELECT * FROM Tasks
      WHERE parent_task_id = @taskId
      ORDER BY due_date ASC, priority ASC
    `;
    
    const subtasks = await executeQuery(subtasksQuery, { taskId });
    
    return NextResponse.json({
      ...processedTask,
      subtasks
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT to update a task
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const {
      title,
      description,
      due_date,
      priority,
      recurrence_pattern,
      parent_task_id,
      is_recurring,
      completed_at,
      tags = []
    } = body;
    
    // Use a transaction to update the task and its tags
    return await withTransaction(async (transaction) => {
      // Build update query dynamically based on provided fields
      let updateQuery = "UPDATE Tasks SET ";
      const updateFields = [];
      const params: Record<string, any> = { taskId };
      
      if (title !== undefined) {
        updateFields.push("title = @title");
        params.title = title;
      }
      
      if (description !== undefined) {
        updateFields.push("description = @description");
        params.description = description;
      }
      
      if (due_date !== undefined) {
        updateFields.push("due_date = @due_date");
        params.due_date = due_date ? new Date(due_date) : null;
      }
      
      if (priority !== undefined) {
        updateFields.push("priority = @priority");
        params.priority = priority;
      }
      
      if (recurrence_pattern !== undefined) {
        updateFields.push("recurrence_pattern = @recurrence_pattern");
        params.recurrence_pattern = recurrence_pattern;
      }
      
      if (parent_task_id !== undefined) {
        updateFields.push("parent_task_id = @parent_task_id");
        params.parent_task_id = parent_task_id;
      }
      
      if (is_recurring !== undefined) {
        updateFields.push("is_recurring = @is_recurring");
        params.is_recurring = is_recurring;
      }
      
      if (completed_at !== undefined) {
        updateFields.push("completed_at = @completed_at");
        params.completed_at = completed_at ? new Date(completed_at) : null;
      }
      
      if (updateFields.length === 0) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 }
        );
      }
      
      updateQuery += updateFields.join(", ") + " WHERE task_id = @taskId";
      updateQuery += " OUTPUT INSERTED.*";
      
      // Execute update within transaction
      const request = transaction.request();
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
      
      const result = await request.query(updateQuery);
      const updatedTask = result.recordset[0];
      
      // Update tags if provided
      if (tags.length > 0) {
        // First, delete existing tag mappings
        const deleteTagMappingsQuery = `
          DELETE FROM TaskTagMapping 
          WHERE task_id = @taskId
        `;
        
        const deleteRequest = transaction.request();
        deleteRequest.input('taskId', taskId);
        await deleteRequest.query(deleteTagMappingsQuery);
        
        // Then add new tag mappings
        for (const tagName of tags) {
          // Check if tag exists, if not create it
          const tagRequest = transaction.request();
          tagRequest.input('tag_name', tagName);
          
          const tagQuery = `
            MERGE INTO TaskTags WITH (HOLDLOCK) AS target
            USING (SELECT @tag_name as tag_name) AS source
            ON target.tag_name = source.tag_name
            WHEN NOT MATCHED THEN
                INSERT (tag_name) VALUES (@tag_name)
            OUTPUT INSERTED.tag_id;
          `;
          
          const tagResult = await tagRequest.query(tagQuery);
          const tagId = tagResult.recordset[0].tag_id;
          
          // Associate tag with task
          const mapRequest = transaction.request();
          mapRequest.input('task_id', taskId);
          mapRequest.input('tag_id', tagId);
          
          const mapTagQuery = `
            INSERT INTO TaskTagMapping (task_id, tag_id)
            VALUES (@task_id, @tag_id)
          `;
          
          await mapRequest.query(mapTagQuery);
        }
      }
      
      // Return updated task with tags
      return NextResponse.json({
        ...updatedTask,
        tags
      });
    });
    
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }
    
    return await withTransaction(async (transaction) => {
      // First check if task has subtasks
      const subtasksCheckRequest = transaction.request();
      subtasksCheckRequest.input('taskId', taskId);
      
      const subtasksQuery = `
        SELECT COUNT(*) AS count FROM Tasks
        WHERE parent_task_id = @taskId
      `;
      
      const subtasksResult = await subtasksCheckRequest.query(subtasksQuery);
      const subtasksCount = subtasksResult.recordset[0].count;
      
      if (subtasksCount > 0) {
        return NextResponse.json(
          { error: "Cannot delete task with subtasks. Delete subtasks first or update them." },
          { status: 400 }
        );
      }
      
      // Delete tag mappings first
      const deleteTagMappingsRequest = transaction.request();
      deleteTagMappingsRequest.input('taskId', taskId);
      
      const deleteTagMappingsQuery = `
        DELETE FROM TaskTagMapping 
        WHERE task_id = @taskId
      `;
      
      await deleteTagMappingsRequest.query(deleteTagMappingsQuery);
      
      // Delete any attachments
      const deleteAttachmentsRequest = transaction.request();
      deleteAttachmentsRequest.input('taskId', taskId);
      
      const deleteAttachmentsQuery = `
        DELETE FROM Attachments
        WHERE task_id = @taskId
      `;
      
      await deleteAttachmentsRequest.query(deleteAttachmentsQuery);
      
      // Delete the task
      const deleteTaskRequest = transaction.request();
      deleteTaskRequest.input('taskId', taskId);
      
      const deleteTaskQuery = `
        DELETE FROM Tasks
        WHERE task_id = @taskId
        OUTPUT DELETED.task_id
      `;
      
      const result = await deleteTaskRequest.query(deleteTaskQuery);
      
      if (result.recordset.length === 0) {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: "Task deleted successfully",
        taskId
      });
    });
    
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}