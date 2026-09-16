export interface RevisionFact {
  id: string;
  category: string;
  fact: string;
  relatedTopic: string;
}

export const revisionData: RevisionFact[] = [
  {
    id: "rev-001",
    category: "Polity",
    fact: "Article 32 is known as the Right to Constitutional Remedies and was called the 'heart and soul' of the Constitution by Dr. B.R. Ambedkar.",
    relatedTopic: "Fundamental Rights"
  },
  {
    id: "rev-002",
    category: "Economy",
    fact: "The Philips Curve shows the inverse relationship between the rate of unemployment and the rate of inflation in an economy.",
    relatedTopic: "Macroeconomics"
  },
  {
    id: "rev-003",
    category: "Environment",
    fact: "The Wildlife Protection Act was enacted in 1972, providing for the protection of wild animals, birds, and plants.",
    relatedTopic: "Environmental Legislation"
  },
  {
    id: "rev-004",
    category: "History",
    fact: "The Morley-Minto Reforms (1909) introduced the system of separate electorates for Muslims.",
    relatedTopic: "Modern Indian History"
  },
  {
    id: "rev-005",
    category: "Geography",
    fact: "Roaring Forties are strong westerly winds found in the Southern Hemisphere, generally between the latitudes of 40 and 50 degrees.",
    relatedTopic: "Climatology"
  }
];
