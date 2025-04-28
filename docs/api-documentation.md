# Ustadi Frontend API Documentation

This document provides a comprehensive overview of all API endpoints for the Ustadi Frontend application. It follows the RESTful pattern with CRUD operations for each resource.

## Table of Contents
1. [Authentication](#authentication)
2. [Tasks](#tasks)
3. [Task Tags](#task-tags)
4. [Attachments](#attachments)
5. [Study Sessions](#study-sessions)
6. [Comments](#comments)
7. [Flashcards](#flashcards)
8. [Quizzes](#quizzes)
9. [Questions](#questions)
10. [Study Groups](#study-groups)
11. [Group Members](#group-members)
12. [Leaderboard](#leaderboard)
13. [Activity Log](#activity-log)
14. [Analytics](#analytics)

## Authentication
APIs for user authentication and management.

### Register ✅ (Existing)
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new student account
- **Request Body:**
  ```json
  {
    "email": "example@email.com",
    "password": "securepassword",
    "full_name": "Student Name"
  }
  ```
- **Response:** Newly created student object

### Login ✅ (Existing)
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate a student and get session token
- **Request Body:**
  ```json
  {
    "email": "example@email.com",
    "password": "securepassword"
  }
  ```
- **Response:** Authentication token and user details

### Get Current User ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/students/me`
- **Description:** Get the current authenticated student's information
- **Response:** Student object

### Update User ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/students/me`
- **Description:** Update the current authenticated student's information
- **Request Body:** Fields to update
- **Response:** Updated student object

## Tasks
APIs for managing student tasks and assignments.

### List Tasks ✅ (Existing)
- **Endpoint:** `GET /api/tasks`
- **Description:** Get all tasks for the current student
- **Query Parameters:**
  - `completed`: Filter by completion status (boolean)
  - `due_before`: Filter tasks due before date (ISO string)
  - `due_after`: Filter tasks due after date (ISO string)
  - `priority`: Filter by priority (number)
  - `tag`: Filter by tag name (string)
- **Response:** Array of task objects

### Create Task ✅ (Existing)
- **Endpoint:** `POST /api/tasks`
- **Description:** Create a new task
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "title": "Complete assignment",
    "description": "Math homework problems 1-10",
    "due_date": "2025-04-30T23:59:59Z",
    "priority": 2,
    "recurrence_pattern": "WEEKLY",
    "parent_task_id": null,
    "is_recurring": true,
    "tags": ["Math", "Homework"]
  }
  ```
- **Response:** Newly created task object

### Get Task ✅ (Existing)
- **Endpoint:** `GET /api/tasks/{id}`
- **Description:** Get a specific task by ID
- **Response:** Task object with associated tags and subtasks

### Update Task ✅ (Existing)
- **Endpoint:** `PUT /api/tasks/{id}`
- **Description:** Update a specific task
- **Request Body:** Fields to update
- **Response:** Updated task object

### Delete Task ✅ (Existing)
- **Endpoint:** `DELETE /api/tasks/{id}`
- **Description:** Delete a specific task
- **Response:** Success message

## Task Tags
APIs for managing task tags.

### List Tags ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/tags`
- **Description:** Get all tags available for the current student
- **Response:** Array of tag objects

### Create Tag ⚠️ (To Be Implemented)
- **Endpoint:** `POST /api/tags`
- **Description:** Create a new tag
- **Request Body:**
  ```json
  {
    "tag_name": "Homework"
  }
  ```
- **Response:** Newly created tag object

### Update Tag ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/tags/{id}`
- **Description:** Update a specific tag
- **Request Body:**
  ```json
  {
    "tag_name": "Updated Tag Name"
  }
  ```
- **Response:** Updated tag object

### Delete Tag ⚠️ (To Be Implemented)
- **Endpoint:** `DELETE /api/tags/{id}`
- **Description:** Delete a specific tag
- **Response:** Success message

## Attachments
APIs for managing file attachments.

### List Task Attachments ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/tasks/{task_id}/attachments`
- **Description:** Get all attachments for a specific task
- **Response:** Array of attachment objects

### Upload Attachment ⚠️ (To Be Implemented)
- **Endpoint:** `POST /api/tasks/{task_id}/attachments`
- **Description:** Upload a new file attachment for a task
- **Request Body:** Multipart form with file
- **Response:** Newly created attachment object

### Delete Attachment ⚠️ (To Be Implemented)
- **Endpoint:** `DELETE /api/attachments/{id}`
- **Description:** Delete a specific attachment
- **Response:** Success message

## Study Sessions
APIs for managing study sessions.

### List Study Sessions ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/study-sessions`
- **Description:** Get all study sessions for the current student
- **Query Parameters:**
  - `start_date`: Filter sessions after this date (ISO string)
  - `end_date`: Filter sessions before this date (ISO string)
  - `session_type`: Filter by session type (string)
- **Response:** Array of study session objects

### Create Study Session ⚠️ (To Be Implemented)
- **Endpoint:** `POST /api/study-sessions`
- **Description:** Create a new study session
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "start_time": "2025-04-22T14:00:00Z",
    "end_time": "2025-04-22T16:00:00Z",
    "duration_minutes": 120,
    "session_type": "Pomodoro",
    "task_id": 5
  }
  ```
- **Response:** Newly created study session object

### Get Study Session ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/study-sessions/{id}`
- **Description:** Get a specific study session by ID
- **Response:** Study session object

### Update Study Session ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/study-sessions/{id}`
- **Description:** Update a specific study session
- **Request Body:** Fields to update
- **Response:** Updated study session object

### Delete Study Session ⚠️ (To Be Implemented)
- **Endpoint:** `DELETE /api/study-sessions/{id}`
- **Description:** Delete a specific study session
- **Response:** Success message

## Comments
APIs for managing comments on tasks.

### List Task Comments ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/tasks/{task_id}/comments`
- **Description:** Get all comments for a specific task
- **Response:** Array of comment objects

### Create Comment ⚠️ (To Be Implemented)
- **Endpoint:** `POST /api/tasks/{task_id}/comments`
- **Description:** Create a new comment on a task
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "content": "This is a comment on the task",
    "parent_comment_id": null
  }
  ```
- **Response:** Newly created comment object

### Update Comment ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/comments/{id}`
- **Description:** Update a specific comment
- **Request Body:**
  ```json
  {
    "content": "Updated comment content"
  }
  ```
- **Response:** Updated comment object

### Delete Comment ⚠️ (To Be Implemented)
- **Endpoint:** `DELETE /api/comments/{id}`
- **Description:** Delete a specific comment
- **Response:** Success message

## Flashcards
APIs for managing flashcards (revisions).

### List Flashcards ✅ (Existing)
- **Endpoint:** `GET /api/revisions`
- **Description:** Get all flashcards for the current student
- **Query Parameters:**
  - `student_id`: Filter by student ID (number)
  - `due`: Filter cards due for review (boolean)
  - `tag`: Filter by tag (string)
  - `search`: Search query for content (string)
  - `limit`: Limit number of results (number)
- **Response:** Array of flashcard objects

### Create Flashcard ✅ (Existing)
- **Endpoint:** `POST /api/revisions`
- **Description:** Create a new flashcard
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "front_content": "What is the capital of France?",
    "back_content": "Paris",
    "tags": ["Geography", "Europe"]
  }
  ```
- **Response:** Newly created flashcard object

### Get Flashcard ✅ (Existing)
- **Endpoint:** `GET /api/revisions/{id}`
- **Description:** Get a specific flashcard by ID
- **Response:** Flashcard object

### Update Flashcard ✅ (Existing)
- **Endpoint:** `PUT /api/revisions/{id}`
- **Description:** Update a specific flashcard
- **Request Body:** Fields to update (can include review_quality for spaced repetition)
- **Response:** Updated flashcard object

### Delete Flashcard ✅ (Existing)
- **Endpoint:** `DELETE /api/revisions/{id}`
- **Description:** Delete a specific flashcard
- **Response:** Success message

## Quizzes
APIs for managing quizzes.

### List Quizzes ✅ (Existing)
- **Endpoint:** `GET /api/quizzes`
- **Description:** Get all quizzes for the current student
- **Query Parameters:**
  - `student_id`: Filter by student ID (number)
  - `is_public`: Include public quizzes from other students (boolean)
  - `search`: Search query for title/description (string)
- **Response:** Array of quiz objects (without questions)

### Create Quiz ✅ (Existing)
- **Endpoint:** `POST /api/quizzes`
- **Description:** Create a new quiz
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "title": "Mathematics Quiz",
    "description": "Test your algebra skills",
    "is_public": true,
    "questions": [
      {
        "question_type": "MCQ",
        "content": "What is 2+2?",
        "correct_answer": "4",
        "options": ["2", "3", "4", "5"]
      }
    ]
  }
  ```
- **Response:** Newly created quiz object

### Get Quiz ✅ (Existing)
- **Endpoint:** `GET /api/quizzes/{id}`
- **Description:** Get a specific quiz by ID (including questions)
- **Response:** Quiz object with questions

### Update Quiz ✅ (Existing)
- **Endpoint:** `PUT /api/quizzes/{id}`
- **Description:** Update a specific quiz
- **Request Body:** Fields to update
- **Response:** Updated quiz object

### Delete Quiz ✅ (Existing)
- **Endpoint:** `DELETE /api/quizzes/{id}`
- **Description:** Delete a specific quiz
- **Response:** Success message

## Questions
APIs for managing quiz questions.

### List Quiz Questions ✅ (Existing)
- **Endpoint:** `GET /api/quizzes/{quiz_id}/questions`
- **Description:** Get all questions for a specific quiz
- **Response:** Array of question objects

### Add Question to Quiz ✅ (Existing)
- **Endpoint:** `POST /api/quizzes/{quiz_id}/questions`
- **Description:** Add a new question to a quiz
- **Request Body:**
  ```json
  {
    "question_type": "MCQ",
    "content": "What is the square root of 16?",
    "correct_answer": "4",
    "options": ["2", "4", "6", "8"]
  }
  ```
- **Response:** Newly created question object

### Update Question ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/questions/{id}`
- **Description:** Update a specific question
- **Request Body:** Fields to update
- **Response:** Updated question object

### Delete Question ⚠️ (To Be Implemented)
- **Endpoint:** `DELETE /api/questions/{id}`
- **Description:** Delete a specific question
- **Response:** Success message

## Study Groups
APIs for managing study groups.

### List Groups ✅ (Existing)
- **Endpoint:** `GET /api/groups`
- **Description:** Get all groups
- **Query Parameters:**
  - `student_id`: Filter by groups the student belongs to (number)
  - `is_active`: Filter by active status (boolean)
- **Response:** Array of group objects

### Create Group ✅ (Existing)
- **Endpoint:** `POST /api/groups`
- **Description:** Create a new study group
- **Request Body:**
  ```json
  {
    "group_name": "Physics Study Group",
    "created_by": 1,
    "description": "A group for studying physics together"
  }
  ```
- **Response:** Newly created group object

### Get Group ✅ (Existing)
- **Endpoint:** `GET /api/groups/{id}`
- **Description:** Get a specific group by ID
- **Response:** Group object with meetings

### Update Group ✅ (Existing)
- **Endpoint:** `PUT /api/groups/{id}`
- **Description:** Update a specific group
- **Request Body:** Fields to update
- **Response:** Updated group object

### Delete Group ✅ (Existing)
- **Endpoint:** `DELETE /api/groups/{id}`
- **Description:** Delete a specific group (or mark as inactive)
- **Response:** Success message

## Group Members
APIs for managing study group membership.

### List Group Members ✅ (Existing)
- **Endpoint:** `GET /api/groups/{group_id}/members`
- **Description:** Get all members for a specific group
- **Response:** Array of member objects with student information

### Add Member to Group ✅ (Existing)
- **Endpoint:** `POST /api/groups/{group_id}/members`
- **Description:** Add a student to a group
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "role": "Member"
  }
  ```
- **Response:** Newly added member object

### Update Member Role ⚠️ (To Be Implemented)
- **Endpoint:** `PUT /api/groups/{group_id}/members/{student_id}`
- **Description:** Update a member's role in a group
- **Request Body:**
  ```json
  {
    "role": "Leader"
  }
  ```
- **Response:** Updated member object

### Remove Member from Group ✅ (Existing)
- **Endpoint:** `DELETE /api/groups/{group_id}/members?student_id={student_id}`
- **Description:** Remove a student from a group
- **Response:** Success message

## Group Meetings ⚠️ (To Be Implemented)
APIs for managing group meetings.

### List Group Meetings
- **Endpoint:** `GET /api/groups/{group_id}/meetings`
- **Description:** Get all meetings for a specific group
- **Response:** Array of meeting objects

### Create Meeting
- **Endpoint:** `POST /api/groups/{group_id}/meetings`
- **Description:** Create a new meeting for a group
- **Request Body:**
  ```json
  {
    "date": "2025-04-30T18:00:00Z",
    "topic": "Final Exam Review",
    "location": "Library Study Room 3",
    "duration_minutes": 120
  }
  ```
- **Response:** Newly created meeting object

### Update Meeting
- **Endpoint:** `PUT /api/meetings/{id}`
- **Description:** Update a specific meeting
- **Request Body:** Fields to update
- **Response:** Updated meeting object

### Delete Meeting
- **Endpoint:** `DELETE /api/meetings/{id}`
- **Description:** Delete a specific meeting
- **Response:** Success message

## Leaderboard
APIs for leaderboard data.

### Get Leaderboard ✅ (Existing)
- **Endpoint:** `GET /api/leaderboard`
- **Description:** Get leaderboard rankings
- **Query Parameters:**
  - `period`: Time period ('Weekly', 'Monthly', or 'AllTime')
  - `category`: Activity category filter
- **Response:** Array of leaderboard entries

### Get Activity Points ✅ (Existing)
- **Endpoint:** `GET /api/leaderboard/activities`
- **Description:** Get point-earning activities
- **Query Parameters:**
  - `studentId`: Filter by student ID (number)
- **Response:** Array of point activity objects

## Activity Log
APIs for tracking student activities.

### List Activity Logs ⚠️ (To Be Implemented)
- **Endpoint:** `GET /api/activity-logs`
- **Description:** Get activity logs for the current student
- **Query Parameters:**
  - `from_date`: Filter logs after this date (ISO string)
  - `to_date`: Filter logs before this date (ISO string)
  - `activity_type`: Filter by activity type (string)
- **Response:** Array of activity log objects

### Create Activity Log ⚠️ (To Be Implemented)
- **Endpoint:** `POST /api/activity-logs`
- **Description:** Record a new activity
- **Request Body:**
  ```json
  {
    "student_id": 1,
    "activity_type": "Task Completion",
    "points_earned": 10,
    "related_task_id": 5
  }
  ```
- **Response:** Newly created activity log object

## Analytics
APIs for analytics data.

### Get Student Analytics ✅ (Existing)
- **Endpoint:** `GET /api/analytics`
- **Description:** Get analytics data for the current student
- **Response:** 
  ```json
  {
    "studyTimeOverview": [...],
    "taskCompletionRates": {...},
    "subjectDistribution": [...],
    "performanceOverTime": [...],
    "streakData": {...}
  }
  ```

## Status Legend

- ✅ **Existing** - Endpoint is already implemented in the codebase
- ⚠️ **To Be Implemented** - Endpoint needs to be created

## Technical Notes

1. Authentication is required for all endpoints except login and register
2. All endpoints adhere to standard HTTP status codes:
   - 200: Success
   - 201: Resource created
   - 400: Bad request / validation error
   - 401: Unauthorized / not authenticated
   - 403: Forbidden / no permission
   - 404: Resource not found
   - 500: Server error
3. All timestamp fields use ISO 8601 format
4. Pagination is supported via `limit` and `offset` query parameters where appropriate