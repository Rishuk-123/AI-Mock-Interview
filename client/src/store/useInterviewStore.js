import { create } from "zustand";

const INITIAL_HISTORY = [
  {
    id: "1",
    role: "Frontend Developer",
    company: "BlackRock",
    type: "Technical",
    difficulty: "Medium",
    date: "09 Aug 2026",
    score: 80,
    status: "Completed",
    questions: [
      "Can you explain the Virtual DOM in React and how it optimizes UI updates?",
      "What is the difference between state and props in React?",
    ],
    answers: [
      "The Virtual DOM is an in-memory representation of the real DOM. React uses it to diff changes and efficiently apply batch updates.",
      "Props are passed into a component from its parent, while state is managed internally within the component.",
    ],
  },
];

const useInterviewStore = create((set, get) => ({
  history: localStorage.getItem("interviewHistory")
    ? JSON.parse(localStorage.getItem("interviewHistory"))
    : INITIAL_HISTORY,

  saveInterview: (sessionData) => {
    const currentHistory = get().history;
    
    const newSession = {
      id: sessionData.id || Date.now().toString(),
      role: sessionData.setupConfig?.role || "Frontend Developer",
      company: sessionData.setupConfig?.company || "Tech Practice",
      type: sessionData.setupConfig?.type || "Technical",
      difficulty: sessionData.setupConfig?.difficulty || "Medium",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      score: 85, // Simulated AI evaluation score
      status: "Completed",
      questions: sessionData.questions || [],
      answers: sessionData.answers || [],
    };

    const updatedHistory = [newSession, ...currentHistory];
    
    localStorage.setItem("interviewHistory", JSON.stringify(updatedHistory));
    set({ history: updatedHistory });

    return newSession;
  },

  getInterviewById: (id) => {
    return get().history.find((item) => item.id === id);
  },
}));

export default useInterviewStore;