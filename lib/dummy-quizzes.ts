// Dummy quiz data for testing
export const dummyQuizzes = [
  {
    quiz_id: 1,
    student_id: 1,
    title: "Mathematics Basics",
    description: "Test your knowledge of fundamental mathematics concepts",
    created_at: "2025-04-15T10:30:00Z",
    is_public: true,
    questions_count: 3,
    questions: [
      {
        question_id: 1,
        quiz_id: 1,
        question_type: "MCQ",
        content: "What is 2 + 2?",
        correct_answer: "4",
        options: ["2", "3", "4", "5"]
      },
      {
        question_id: 2,
        quiz_id: 1,
        question_type: "MCQ",
        content: "What is the square root of 16?",
        correct_answer: "4",
        options: ["2", "4", "6", "8"]
      },
      {
        question_id: 3,
        quiz_id: 1,
        question_type: "Short Answer",
        content: "What is the formula for the area of a circle?",
        correct_answer: "πr²"
      }
    ]
  },
  {
    quiz_id: 2,
    student_id: 1,
    title: "Computer Science Fundamentals",
    description: "A quiz on basic computer science concepts",
    created_at: "2025-04-14T15:45:00Z",
    is_public: true,
    questions_count: 4,
    questions: [
      {
        question_id: 4,
        quiz_id: 2,
        question_type: "MCQ",
        content: "Which of the following is NOT a programming language?",
        correct_answer: "HTTP",
        options: ["Python", "JavaScript", "HTTP", "Java"]
      },
      {
        question_id: 5,
        quiz_id: 2,
        question_type: "MCQ",
        content: "What does CPU stand for?",
        correct_answer: "Central Processing Unit",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Core Processing Unit"]
      },
      {
        question_id: 6,
        quiz_id: 2,
        question_type: "Short Answer",
        content: "What is the main function of RAM?",
        correct_answer: "Temporary data storage"
      },
      {
        question_id: 7,
        quiz_id: 2,
        question_type: "Long Answer",
        content: "Explain the concept of object-oriented programming.",
        correct_answer: "Object-oriented programming is a programming paradigm based on the concept of objects, which can contain data and code. The data is in the form of fields (attributes), and the code is in the form of procedures (methods)."
      }
    ]
  },
  {
    quiz_id: 3,
    student_id: 2,
    title: "World Geography",
    description: "Test your knowledge of global geography",
    created_at: "2025-04-13T09:15:00Z",
    is_public: true,
    questions_count: 3,
    questions: [
      {
        question_id: 8,
        quiz_id: 3,
        question_type: "MCQ",
        content: "What is the capital of France?",
        correct_answer: "Paris",
        options: ["London", "Berlin", "Paris", "Rome"]
      },
      {
        question_id: 9,
        quiz_id: 3,
        question_type: "MCQ",
        content: "Which continent is the largest by land area?",
        correct_answer: "Asia",
        options: ["Africa", "Asia", "Europe", "North America"]
      },
      {
        question_id: 10,
        quiz_id: 3,
        question_type: "Short Answer",
        content: "Which river is the longest in the world?",
        correct_answer: "Nile"
      }
    ]
  },
  {
    quiz_id: 4,
    student_id: 1,
    title: "History Trivia",
    description: "A quick quiz about historical events and figures",
    created_at: "2025-04-12T14:25:00Z",
    is_public: false,
    questions_count: 2,
    questions: [
      {
        question_id: 11,
        quiz_id: 4,
        question_type: "MCQ",
        content: "In which year did World War II end?",
        correct_answer: "1945",
        options: ["1918", "1939", "1945", "1950"]
      },
      {
        question_id: 12,
        quiz_id: 4,
        question_type: "Short Answer",
        content: "Who was the first President of the United States?",
        correct_answer: "George Washington"
      }
    ]
  },
  {
    quiz_id: 5,
    student_id: 3,
    title: "Science Quiz",
    description: "Test your knowledge of basic scientific concepts",
    created_at: "2025-04-11T11:00:00Z",
    is_public: true,
    questions_count: 3,
    questions: [
      {
        question_id: 13,
        quiz_id: 5,
        question_type: "MCQ",
        content: "What is the chemical symbol for gold?",
        correct_answer: "Au",
        options: ["Ag", "Au", "Fe", "Cu"]
      },
      {
        question_id: 14,
        quiz_id: 5,
        question_type: "MCQ",
        content: "What is the process by which plants make food?",
        correct_answer: "Photosynthesis",
        options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"]
      },
      {
        question_id: 15,
        quiz_id: 5,
        question_type: "Short Answer",
        content: "What is the closest planet to the Sun?",
        correct_answer: "Mercury"
      }
    ]
  }
];