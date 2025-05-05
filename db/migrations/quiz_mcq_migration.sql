-- Modify the Questions table to support MCQs with four options
ALTER TABLE Questions
ADD option_a NVARCHAR(MAX) NULL,
    option_b NVARCHAR(MAX) NULL,
    option_c NVARCHAR(MAX) NULL,
    option_d NVARCHAR(MAX) NULL;

-- Update the question_type constraint to only allow MCQ
ALTER TABLE Questions
DROP CONSTRAINT IF EXISTS CK_Questions_QuestionType;

ALTER TABLE Questions
ADD CONSTRAINT CK_Questions_QuestionType CHECK (question_type = 'MCQ');

-- Create a table to track quiz attempts
CREATE TABLE QuizAttempts (
    attempt_id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT FOREIGN KEY REFERENCES Quizzes(quiz_id),
    student_id INT FOREIGN KEY REFERENCES Students(student_id),
    start_time DATETIME DEFAULT GETDATE(),
    end_time DATETIME NULL,
    score INT NULL,
    total_questions INT NOT NULL,
    is_completed BIT DEFAULT 0
);

-- Create a table to track answers in quiz attempts
CREATE TABLE QuizAnswers (
    answer_id INT PRIMARY KEY IDENTITY(1,1),
    attempt_id INT FOREIGN KEY REFERENCES QuizAttempts(attempt_id) ON DELETE CASCADE,
    question_id INT FOREIGN KEY REFERENCES Questions(question_id),
    selected_option CHAR(1) CHECK (selected_option IN ('a', 'b', 'c', 'd')),
    is_correct BIT NOT NULL,
    CONSTRAINT UQ_AttemptQuestion UNIQUE (attempt_id, question_id)
);

-- Add indexes for performance
CREATE INDEX IX_QuizAttempts_Student ON QuizAttempts(student_id);
CREATE INDEX IX_QuizAttempts_Quiz ON QuizAttempts(quiz_id);
CREATE INDEX IX_QuizAnswers_Attempt ON QuizAnswers(attempt_id);