export type TestQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  subject: string;
};

export type Test = {
  id: string;
  title: string;
  type: "GS" | "CSAT" | "PYQ" | "Subject";
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  year?: number;
  questions: TestQuestion[];
};

export const sampleTests: Test[] = [
  {
    id: "mock-gs-mini-1",
    title: "Mini GS Mock Test 1",
    type: "GS",
    totalQuestions: 5,
    durationMinutes: 10,
    totalMarks: 10,
    positiveMarks: 2,
    negativeMarks: 0.66,
    questions: [
      {
        id: "q1",
        text: "Consider the following statements regarding the 'Basic Structure' doctrine:\n1. It was first articulated in the Kesavananda Bharati case.\n2. The Constitution explicitly defines what constitutes the Basic Structure.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswerIndex: 0,
        explanation: "The Basic Structure doctrine was established by the Supreme Court in the Kesavananda Bharati case (1973). The Constitution does not define the basic structure; it has been evolved by the judiciary.",
        subject: "Polity",
      },
      {
        id: "q2",
        text: "Which of the following is NOT a greenhouse gas?",
        options: ["Carbon dioxide", "Methane", "Nitrous oxide", "Argon"],
        correctAnswerIndex: 3,
        explanation: "Argon is a noble gas and makes up about 0.93% of the Earth's atmosphere. It is not a greenhouse gas.",
        subject: "Environment",
      },
      {
        id: "q3",
        text: "The term 'Stagflation' refers to a situation where:",
        options: [
          "High inflation is accompanied by high economic growth.",
          "High inflation is accompanied by high unemployment and stagnant demand.",
          "Low inflation is accompanied by high economic growth.",
          "Prices are falling continuously."
        ],
        correctAnswerIndex: 1,
        explanation: "Stagflation is an economic cycle characterized by slow growth and a high unemployment rate accompanied by inflation.",
        subject: "Economy",
      },
      {
        id: "q4",
        text: "The 'Quit India Movement' was launched in response to:",
        options: ["Cabinet Mission Plan", "Cripps Proposal", "Simon Commission Report", "Wavell Plan"],
        correctAnswerIndex: 1,
        explanation: "The Quit India Movement was launched on 8 August 1942 at the Bombay session of the All-India Congress Committee in response to the failure of the Cripps Mission.",
        subject: "History",
      },
      {
        id: "q5",
        text: "Where is the headquarters of the International Seabed Authority (ISA) located?",
        options: ["Geneva", "New York", "Kingston", "Paris"],
        correctAnswerIndex: 2,
        explanation: "The International Seabed Authority is an intergovernmental body based in Kingston, Jamaica, that was established to organize, regulate and control all mineral-related activities in the international seabed area beyond the limits of national jurisdiction.",
        subject: "Geography",
      }
    ]
  },
  {
    id: "pyq-gs-2023",
    title: "UPSC CSE Prelims 2023 - GS Paper 1",
    type: "PYQ",
    year: 2023,
    totalQuestions: 100,
    durationMinutes: 120,
    totalMarks: 200,
    positiveMarks: 2,
    negativeMarks: 0.66,
    questions: [] // Intentionally empty for sample
  }
];
