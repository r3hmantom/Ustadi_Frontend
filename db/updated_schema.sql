CREATE TABLE Students
(
    student_id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255),
    registration_date DATETIME DEFAULT GETDATE(),
    last_login DATETIME,
    is_active BIT DEFAULT 1
);

GO

CREATE TABLE Tasks
(
    task_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id) ON DELETE CASCADE,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    due_date DATETIME,
    priority INT DEFAULT 3,
    recurrence_pattern NVARCHAR(100),
    parent_task_id INT FOREIGN KEY REFERENCES Tasks(task_id),
    created_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME,
    is_recurring BIT DEFAULT 0
);
GO
CREATE TABLE TaskTags
(
    tag_id INT PRIMARY KEY IDENTITY(1,1),
    tag_name NVARCHAR(50) UNIQUE NOT NULL
);
GO
CREATE TABLE TaskTagMapping
(
    task_id INT FOREIGN KEY REFERENCES Tasks(task_id),
    tag_id INT FOREIGN KEY REFERENCES TaskTags(tag_id),
    PRIMARY KEY (task_id, tag_id)
);
GO
CREATE TABLE Attachments
(
    attachment_id INT PRIMARY KEY IDENTITY(1,1),
    task_id INT FOREIGN KEY REFERENCES Tasks(task_id),
    file_name NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(MAX) NOT NULL,
    uploaded_at DATETIME DEFAULT GETDATE()
);
GO
CREATE TABLE StudySessions
(
    session_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    session_type NVARCHAR(50) CHECK (session_type IN ('Pomodoro', 'Revision', 'Group Study')),
    task_id INT FOREIGN KEY REFERENCES Tasks(task_id)
);
GO
CREATE TABLE Comments
(
    comment_id INT PRIMARY KEY IDENTITY(1,1),
    task_id INT FOREIGN KEY REFERENCES Tasks(task_id) ON DELETE CASCADE,
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    parent_comment_id INT FOREIGN KEY REFERENCES Comments(comment_id)
);
GO
CREATE TABLE Flashcards
(
    flashcard_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    front_content NVARCHAR(MAX) NOT NULL,
    back_content NVARCHAR(MAX) NOT NULL,
    next_review_date DATETIME NOT NULL,
    interval_days INT DEFAULT 1,
    ease_factor FLOAT DEFAULT 2.5,
    created_at DATETIME DEFAULT GETDATE()
);
GO
CREATE TABLE Quizzes
(
    quiz_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    is_public BIT DEFAULT 0
);
GO
CREATE TABLE Questions
(
    question_id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT FOREIGN KEY REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    question_type NVARCHAR(50) CHECK (question_type = 'MCQ'),
    content NVARCHAR(MAX) NOT NULL,
    option_a NVARCHAR(MAX) NOT NULL,
    option_b NVARCHAR(MAX) NOT NULL,
    option_c NVARCHAR(MAX) NOT NULL,
    option_d NVARCHAR(MAX) NOT NULL,
    correct_answer CHAR(1) CHECK (correct_answer IN ('a', 'b', 'c', 'd'))
);
GO
CREATE TABLE QuizAttempts
(
    attempt_id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT FOREIGN KEY REFERENCES Quizzes(quiz_id),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    start_time DATETIME DEFAULT GETDATE(),
    end_time DATETIME NULL,
    score INT NULL,
    total_questions INT NOT NULL,
    is_completed BIT DEFAULT 0
);
GO
CREATE TABLE QuizAnswers
(
    answer_id INT PRIMARY KEY IDENTITY(1,1),
    attempt_id INT FOREIGN KEY REFERENCES QuizAttempts(attempt_id) ON DELETE CASCADE,
    question_id INT FOREIGN KEY REFERENCES Questions(question_id),
    selected_option CHAR(1) CHECK (selected_option IN ('a', 'b', 'c', 'd')),
    is_correct BIT NOT NULL,
    CONSTRAINT UQ_AttemptQuestion UNIQUE (attempt_id, question_id)
);
GO
CREATE TABLE Groups
(
    group_id INT PRIMARY KEY IDENTITY(1,1),
    group_name NVARCHAR(255) NOT NULL,
    created_by INT FOREIGN KEY REFERENCES Students(student_id),
    created_at DATETIME DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
);
GO
CREATE TABLE GroupMembers
(
    group_id INT FOREIGN KEY REFERENCES Groups(group_id),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    joined_at DATETIME DEFAULT GETDATE(),
    role NVARCHAR(50) CHECK (role IN ('Member', 'Leader')),
    PRIMARY KEY (group_id, student_id)
);
GO
CREATE TABLE Leaderboard
(
    entry_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    period_type NVARCHAR(50) CHECK (period_type IN ('Weekly', 'Monthly')),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    points INT DEFAULT 0,
    rank_position INT
);

GO

CREATE TABLE ActivityLog
(
    log_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    activity_type NVARCHAR(50) NOT NULL,
    activity_date DATETIME DEFAULT GETDATE(),
    points_earned INT DEFAULT 0,
    related_task_id INT FOREIGN KEY REFERENCES Tasks(task_id),
    related_quiz_id INT FOREIGN KEY REFERENCES Quizzes(quiz_id),
    related_session_id INT FOREIGN KEY REFERENCES StudySessions(session_id)
);
GO
-- Indexes
CREATE INDEX IX_Tasks_Student ON Tasks(student_id);
CREATE INDEX IX_Sessions_Student ON StudySessions(student_id);
CREATE INDEX IX_Leaderboard_Period ON Leaderboard(period_type, start_date);
CREATE INDEX IX_ActivityLog_Student ON ActivityLog(student_id, activity_date);

-- Additional indexes for quiz attempt performance
CREATE INDEX IX_QuizAttempts_Student ON QuizAttempts(student_id);
CREATE INDEX IX_QuizAttempts_Quiz ON QuizAttempts(quiz_id);
CREATE INDEX IX_QuizAnswers_Attempt ON QuizAnswers(attempt_id);