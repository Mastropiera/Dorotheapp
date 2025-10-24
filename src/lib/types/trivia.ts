// ------------------------------
// Trivia Game
// ------------------------------

export interface TriviaOption {
    text: string;
    isCorrect: boolean;
  }
  
  export interface TriviaQuestion {
    id: string;
    text: string;
    options: TriviaOption[];
    explanation: string;
  }
  
  export interface TriviaHighScore {
    id: string;
    userName: string;
    score: number;
    date: string; // ISO date string
  }
  