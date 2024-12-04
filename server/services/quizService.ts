import { db } from "db";
import { quizQuestions } from "@db/schema";

const INITIAL_QUESTIONS = [
  {
    question: "What is the largest species of whale?",
    correctAnswer: "Blue Whale",
    wrongAnswer1: "Humpback Whale",
    wrongAnswer2: "Gray Whale",
    wrongAnswer3: "Sperm Whale",
  },
  {
    question: "Which whale species is known for its distinctive white color?",
    correctAnswer: "Beluga Whale",
    wrongAnswer1: "Minke Whale",
    wrongAnswer2: "Fin Whale",
    wrongAnswer3: "Right Whale",
  },
  {
    question: "How long can a sperm whale stay underwater?",
    correctAnswer: "Up to 90 minutes",
    wrongAnswer1: "Up to 30 minutes",
    wrongAnswer2: "Up to 15 minutes",
    wrongAnswer3: "Up to 5 minutes",
  },
  {
    question: "Which whale species is known for breaching (jumping out of water)?",
    correctAnswer: "Humpback Whale",
    wrongAnswer1: "Blue Whale",
    wrongAnswer2: "Bowhead Whale",
    wrongAnswer3: "Sei Whale",
  },
  {
    question: "What do baleen whales use to filter their food?",
    correctAnswer: "Baleen plates",
    wrongAnswer1: "Sharp teeth",
    wrongAnswer2: "Long tongue",
    wrongAnswer3: "Special stomach",
  },
];

export function initializeQuizService() {
  async function initializeQuestions() {
    const existingQuestions = await db.query.quizQuestions.findMany();
    
    if (existingQuestions.length === 0) {
      await db.insert(quizQuestions).values(INITIAL_QUESTIONS);
    }
  }

  async function getRandomQuestions(count: number) {
    const allQuestions = await db.query.quizQuestions.findMany();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Initialize questions on service start
  initializeQuestions();

  return {
    getRandomQuestions,
  };
}
