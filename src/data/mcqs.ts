export interface MCQ {
  id: string;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const mcqsData: MCQ[] = [
  {
    id: "mcq-001",
    category: "Economy",
    question: "Which of the following is responsible for deciding the repo rate in India?",
    options: [
      "Ministry of Finance",
      "Monetary Policy Committee",
      "Prime Minister's Office",
      "NITI Aayog"
    ],
    answer: 1,
    explanation: "The Monetary Policy Committee (MPC) is responsible for fixing the benchmark interest rate in India."
  },
  {
    id: "mcq-002",
    category: "Environment",
    question: "The Montreux Record is a register of:",
    options: [
      "Endangered species of flora and fauna",
      "Wetland sites of international importance under threat",
      "World Heritage Sites in danger",
      "Critically endangered animal species"
    ],
    answer: 1,
    explanation: "The Montreux Record is a register of wetland sites on the List of Wetlands of International Importance where changes in ecological character have occurred, are occurring, or are likely to occur."
  },
  {
    id: "mcq-003",
    category: "Polity",
    question: "The Right to Information is implicitly guaranteed under which Article of the Constitution?",
    options: [
      "Article 14",
      "Article 19(1)(a)",
      "Article 21",
      "Article 32"
    ],
    answer: 1,
    explanation: "The Supreme Court has held that the Right to Information is a fundamental right implicit under Article 19(1)(a) (freedom of speech and expression)."
  },
  {
    id: "mcq-004",
    category: "Science & Tech",
    question: "Vyommitra, recently seen in news, is related to:",
    options: [
      "A new variety of wheat",
      "A humanoid robot for Gaganyaan",
      "A military satellite",
      "An indigenous submarine"
    ],
    answer: 1,
    explanation: "Vyommitra is a female-looking humanoid robot developed by ISRO to function on-board the Gaganyaan spacecraft."
  },
  {
    id: "mcq-005",
    category: "International Relations",
    question: "Which of the following recently became a permanent member of the G20?",
    options: [
      "ASEAN",
      "African Union",
      "SAARC",
      "BIMSTEC"
    ],
    answer: 1,
    explanation: "The African Union was admitted as a permanent member of the G20 at the New Delhi summit in 2023."
  }
];
