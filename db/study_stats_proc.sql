CREATE PROCEDURE GetStudentStudyStatistics
    @StudentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get total completed tasks
    SELECT COUNT(*) AS TotalCompletedTasks
    FROM Tasks
    WHERE student_id = @StudentId AND completed_at IS NOT NULL;
    
    -- Get total study time in minutes
    SELECT ISNULL(SUM(duration_minutes), 0) AS TotalStudyMinutes
    FROM StudySessions
    WHERE student_id = @StudentId;
    
    -- Get average study session duration
    SELECT ISNULL(AVG(duration_minutes), 0) AS AverageSessionMinutes
    FROM StudySessions
    WHERE student_id = @StudentId;
    
    -- Get total number of study sessions
    SELECT COUNT(*) AS TotalStudySessions
    FROM StudySessions
    WHERE student_id = @StudentId;
    
    -- Get task completion by priority
    SELECT 
        priority,
        COUNT(*) AS CompletedCount
    FROM Tasks
    WHERE student_id = @StudentId AND completed_at IS NOT NULL
    GROUP BY priority
    ORDER BY priority;
    
    -- Get total points earned
    SELECT ISNULL(SUM(points_earned), 0) AS TotalPointsEarned
    FROM ActivityLog
    WHERE student_id = @StudentId;
END
GO 