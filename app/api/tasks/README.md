# API Documentation: /api/tasks

This document describes the API endpoints available under `/api/tasks` for managing tasks.

## Endpoints

### 1. Fetch Tasks

- **Method:** `GET`
- **URL:** `/api/tasks`
- **Description:** Retrieves a list of tasks. Can be optionally filtered by `student_id`.
- **Query Parameters:**
  - `student_id` (optional, integer): Filters tasks belonging to a specific student.
- **Responses:**
  - **`200 OK`**: Success. Returns a JSON object containing `{ success: true, data: Task[] }`.
    ```json
    {
      "success": true,
      "data": [
        {
          "task_id": 1,
          "student_id": 101,
          "title": "Complete Math Homework",
          "description": "Chapter 5, exercises 1-10",
          "due_date": "2025-05-10T00:00:00.000Z",
          "priority": 1,
          "recurrence_pattern": null,
          "parent_task_id": null,
          "created_at": "2025-04-30T10:00:00.000Z",
          "completed_at": null,
          "is_recurring": false
        },
        {
          "task_id": 2,
          "student_id": 101,
          "title": "Read History Chapter",
          "description": null,
          "due_date": null,
          "priority": 3,
          "recurrence_pattern": null,
          "parent_task_id": null,
          "created_at": "2025-04-29T15:30:00.000Z",
          "completed_at": null,
          "is_recurring": false
        }
        // ... other tasks
      ]
    }
    ```
  - **`400 Bad Request`**: If `student_id` is provided but is not a valid integer.
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid student_id parameter"
      }
    }
    ```
  - **`500 Internal Server Error`**: If there's a database error or other server issue.
    ```json
    {
      "success": false,
      "error": {
        "message": "Database query failed: [Specific error details]"
      }
    }
    ```
- **Example Request:**
  - Fetch all tasks: `GET /api/tasks`
  - Fetch tasks for student 101: `GET /api/tasks?student_id=101`

---

### 2. Create Task

- **Method:** `POST`
- **URL:** `/api/tasks`
- **Description:** Creates a new task for a student.
- **Request Body:** JSON object containing task details.
  - `student_id` (required, integer): The ID of the student the task belongs to.
  - `title` (required, string): The title or name of the task.
  - `description` (optional, string): A detailed description of the task. Defaults to `null`.
  - `due_date` (optional, string - ISO 8601 format): The date and time the task is due. Defaults to `null`. Example: `"2025-05-15T23:59:59.000Z"`.
  - `priority` (optional, integer): The priority level (e.g., 1=High, 2=Medium, 3=Low). Defaults to `3`.
  - `recurrence_pattern` (optional, string): Defines how the task recurs (e.g., 'daily', 'weekly'). Defaults to `null`.
  - `parent_task_id` (optional, integer): The ID of a parent task if this is a subtask. Defaults to `null`.
  - `is_recurring` (optional, boolean): Whether the task is recurring. Defaults to `false`.
- **Responses:**
  - **`201 Created`**: Success. Returns a JSON object containing `{ success: true, data: Task }` where `Task` is the newly created task object.
    ```json
    {
      "success": true,
      "data": {
        "task_id": 3, // ID assigned by the database
        "student_id": 102,
        "title": "Prepare Presentation",
        "description": "Outline slides for history project",
        "due_date": "2025-05-20T12:00:00.000Z",
        "priority": 2,
        "recurrence_pattern": null,
        "parent_task_id": null,
        "created_at": "2025-04-30T11:00:00.000Z", // Timestamp of creation
        "completed_at": null,
        "is_recurring": false
      }
    }
    ```
  - **`400 Bad Request`**: If required fields (`student_id`, `title`) are missing or the JSON payload is invalid.
    ```json
    // Missing fields
    {
      "success": false,
      "error": {
        "message": "Missing required fields: student_id and title"
      }
    }
    // Invalid JSON
    {
      "success": false,
      "error": {
        "message": "Invalid JSON payload"
      }
    }
    ```
  - **`500 Internal Server Error`**: If there's a database error during insertion or another server issue.
    ```json
    {
      "success": false,
      "error": {
        "message": "Database query failed: [Specific error details]"
        // or "Task creation succeeded but no data returned"
        // or "An unexpected error occurred"
      }
    }
    ```
- **Example Request:**
  ```bash
  curl -X POST http://localhost:3000/api/tasks \
       -H "Content-Type: application/json" \
       -d '{
            "student_id": 102,
            "title": "Prepare Presentation",
            "description": "Outline slides for history project",
            "due_date": "2025-05-20T12:00:00.000Z",
            "priority": 2
          }'
  ```

---

## Task Object Schema

The `Task` object returned by the API has the following structure:

```typescript
interface Task {
  task_id: number; // Unique identifier for the task
  student_id: number; // ID of the student this task belongs to
  title: string; // Title of the task
  description: string | null; // Optional description
  due_date: string | null; // Optional due date (ISO 8601 format string)
  priority: number | null; // Optional priority level
  recurrence_pattern: string | null; // Optional recurrence rule
  parent_task_id: number | null; // Optional ID of the parent task
  created_at: string; // Timestamp when the task was created (ISO 8601 format string)
  completed_at: string | null; // Timestamp when the task was completed (ISO 8601 format string), or null
  is_recurring: boolean; // Flag indicating if the task is recurring
}
```
