import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import sql from "mssql";

// Define types based on the SQL schema
export interface Task {
  task_id: number;
  student_id: number;
  title: string;
  description: string | null;
  due_date: Date | null;
  priority: number;
  recurrence_pattern: string | null;
  parent_task_id: number | null;
  created_at: Date;
  completed_at: Date | null;
  is_recurring: boolean;
  tags?: string[];
}

// GET handler to retrieve all tasks for a student
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // In a real app, get student_id from session/auth
    // For now, we'll use a query param or default to 1 for testing
    const student_id = searchParams.get("student_id") || "1";
    
    // Filter options
    const completed = searchParams.get("completed");
    const priority = searchParams.get("priority");
    const tag = searchParams.get("tag");
    
    // Base query
    let query = `
      SELECT t.*, 
             STRING_AGG(tt.tag_name, ',') AS tags
      FROM Tasks t
      LEFT JOIN TaskTagMapping ttm ON t.task_id = ttm.task_id
      LEFT JOIN TaskTags tt ON ttm.tag_id = tt.tag_id
      WHERE t.student_id = @student_id
    `;
    
    // Add filters
    if (completed === "true") {
      query += " AND t.completed_at IS NOT NULL";
    } else if (completed === "false") {
      query += " AND t.completed_at IS NULL";
    }
    
    if (priority) {
      query += " AND t.priority = @priority";
    }
    
    if (tag) {
      query += " AND tt.tag_name = @tag";
    }
    
    // Group by and order
    query += `
      GROUP BY t.task_id, t.student_id, t.title, t.description, 
               t.due_date, t.priority, t.recurrence_pattern, 
               t.parent_task_id, t.created_at, t.completed_at, t.is_recurring
      ORDER BY 
        CASE WHEN t.completed_at IS NULL THEN 0 ELSE 1 END,  
        CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
        t.due_date ASC,
        t.priority ASC
    `;
    
    const params: Record<string, any> = {
      student_id: parseInt(student_id),
    };
    
    if (priority) {
      params.priority = parseInt(priority);
    }
    
    if (tag) {
      params.tag = tag;
    }
    
    const tasks = await executeQuery<Task>(query, params);
    
    // Process tags for each task
    const processedTasks = tasks.map(task => {
      return {
        ...task,
        tags: task.tags ? task.tags.split(',') : []
      };
    });
    
    return NextResponse.json(processedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST handler to create a new task
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      title,
      description,
      due_date,
      priority,
      recurrence_pattern,
      parent_task_id,
      is_recurring,
      tags = []
    } = body;
    
    // Validate required fields
    if (!student_id || !title) {
      return NextResponse.json(
        { error: "Student ID and title are required" },
        { status: 400 }
      );
    }
    
    // Insert task
    const insertQuery = `
      INSERT INTO Tasks (
        student_id, title, description, due_date, priority, 
        recurrence_pattern, parent_task_id, is_recurring
      )
      OUTPUT INSERTED.*
      VALUES (
        @student_id, @title, @description, @due_date, @priority,
        @recurrence_pattern, @parent_task_id, @is_recurring
      )
    `;
    
    const params = {
      student_id,
      title,
      description: description || null,
      due_date: due_date ? new Date(due_date) : null,
      priority: priority || 3,
      recurrence_pattern: recurrence_pattern || null,
      parent_task_id: parent_task_id || null,
      is_recurring: is_recurring || false
    };
    
    const result = await executeQuery<Task>(insertQuery, params);
    const newTask = result[0];
    
    // Add tags if provided
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Check if tag exists, if not create it
        let tagQuery = `
          MERGE INTO TaskTags WITH (HOLDLOCK) AS target
          USING (SELECT @tag_name as tag_name) AS source
          ON target.tag_name = source.tag_name
          WHEN NOT MATCHED THEN
              INSERT (tag_name) VALUES (@tag_name)
          OUTPUT INSERTED.tag_id;
        `;
        
        const tagResult = await executeQuery<{ tag_id: number }>(tagQuery, { tag_name: tagName });
        const tagId = tagResult[0].tag_id;
        
        // Associate tag with task
        const mapTagQuery = `
          INSERT INTO TaskTagMapping (task_id, tag_id)
          VALUES (@task_id, @tag_id)
        `;
        
        await executeQuery(mapTagQuery, {
          task_id: newTask.task_id,
          tag_id: tagId
        });
      }
    }
    
    // Return the newly created task with tags
    return NextResponse.json({
      ...newTask,
      tags
    });
    
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}