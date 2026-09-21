export type CsatTopicId = 'math' | 'reasoning' | 'comprehension';

export interface CsatQuestion {
  id: string;
  topic: CsatTopicId;
  question: string;
  passage?: string; // Optional passage for Reading Comprehension
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const csatData: Record<CsatTopicId, { title: string, description: string, questions: CsatQuestion[] }> = {
  'math': {
    title: 'Quantitative Aptitude',
    description: 'Number system, percentages, permutation & combination, etc.',
    questions: [
      {
        id: 'q-math-1',
        topic: 'math',
        question: 'A 2-digit number is such that the product of the digits is 8. When 18 is added to the number, then the digits are reversed. The number is:',
        options: ['18', '24', '42', '81'],
        correctOptionIndex: 1, // 24
        explanation: 'Let the digits be x and y. So number = 10x + y.\nProduct xy = 8.\nAlso, 10x + y + 18 = 10y + x => 9y - 9x = 18 => y - x = 2.\nSolving xy = 8 and y - x = 2, we get x = 2 and y = 4.\nSo the number is 24.'
      },
      {
        id: 'q-math-2',
        topic: 'math',
        question: 'If 30% of A = 0.25 of B = 1/5 of C, then A : B : C is equal to:',
        options: ['10 : 12 : 15', '12 : 15 : 10', '15 : 12 : 10', '10 : 15 : 12'],
        correctOptionIndex: 0,
        explanation: '30/100 A = 25/100 B = 1/5 C\n=> 3/10 A = 1/4 B = 1/5 C\nLet this be equal to k.\nA = 10k/3, B = 4k, C = 5k.\nA : B : C = 10/3 : 4 : 5 = 10 : 12 : 15.'
      }
    ]
  },
  'reasoning': {
    title: 'Logical Reasoning',
    description: 'Syllogism, blood relations, seating arrangement, etc.',
    questions: [
      {
        id: 'q-res-1',
        topic: 'reasoning',
        question: 'Statements: All pens are books. Some books are pages.\nConclusions:\nI. Some pages are pens.\nII. All pages are pens.',
        options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'],
        correctOptionIndex: 3,
        explanation: 'The statements establish a relationship between pens and books, and books and pages. However, no direct relationship is established between pages and pens. Therefore, neither conclusion can be logically deduced.'
      },
      {
        id: 'q-res-2',
        topic: 'reasoning',
        question: 'Introducing a boy, a girl said, "He is the son of the daughter of the father of my uncle." How is the boy related to the girl?',
        options: ['Brother', 'Nephew', 'Uncle', 'Son-in-law'],
        correctOptionIndex: 0,
        explanation: 'Father of uncle = Grandfather. Daughter of grandfather = Mother or Aunt. Son of Mother/Aunt = Brother or Cousin. Since "Cousin" is not an option, the closest relation is Brother (assuming the daughter is the girl\'s mother).'
      }
    ]
  },
  'comprehension': {
    title: 'Reading Comprehension',
    description: 'Passages, inferences, assumptions, and central themes.',
    questions: [
      {
        id: 'q-comp-1',
        topic: 'comprehension',
        passage: 'Climate change is not just an environmental issue; it is a profound economic and social challenge. The poorest nations, which have contributed the least to global greenhouse gas emissions, are often the most vulnerable to the impacts of climate change, such as rising sea levels and extreme weather events. Therefore, international cooperation and financial assistance from developed countries are crucial.',
        question: 'Which of the following is the most logical and rational corollary to the above passage?',
        options: [
          'Developed nations should stop their economic activities to reduce emissions.',
          'Climate change impacts only the poorest nations.',
          'Developing nations need support from developed nations to mitigate and adapt to climate change.',
          'Environmental issues are always economic issues.'
        ],
        correctOptionIndex: 2,
        explanation: 'The passage explicitly states that poorest nations are vulnerable despite low emissions, and concludes that financial assistance from developed countries is crucial. Option C best captures this logical extension.'
      }
    ]
  }
};
