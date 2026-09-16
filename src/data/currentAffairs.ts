export interface CurrentAffair {
  id: string;
  date: string;
  category: string;
  title: string;
  whyInNews: string;
  summary: string;
  prelimsFacts: string[];
  staticConnection: string;
  importance: "High" | "Medium" | "Low";
}

export const currentAffairsData: CurrentAffair[] = [
  {
    id: "ca-001",
    date: "2026-09-15",
    category: "Economy",
    title: "RBI Monetary Policy Update",
    whyInNews: "The RBI has kept the repo rate unchanged for the consecutive time.",
    summary: "The Reserve Bank of India uses monetary policy tools to manage inflation and liquidity, impacting the overall money supply in the economy.",
    prelimsFacts: [
      "Repo rate is the rate at which RBI lends to commercial banks.",
      "MPC (Monetary Policy Committee) has 6 members.",
      "Primary objective of monetary policy is maintaining price stability while keeping in mind the objective of growth."
    ],
    staticConnection: "Economy → Monetary Policy → Repo Rate",
    importance: "High",
  },
  {
    id: "ca-002",
    date: "2026-09-15",
    category: "Environment",
    title: "New Ramsar Sites Added in India",
    whyInNews: "Five new wetlands from India have been added to the Ramsar list of wetlands of international importance.",
    summary: "Ramsar Convention is an international treaty for the conservation and sustainable use of wetlands, aiming to halt their worldwide loss.",
    prelimsFacts: [
      "Ramsar Convention was signed in 1971 in Ramsar, Iran.",
      "Chilika Lake was the first Indian wetland of international importance.",
      "Montreux Record is a register of wetland sites on the List of Wetlands of International Importance where changes in ecological character have occurred."
    ],
    staticConnection: "Environment → Biodiversity → Wetlands",
    importance: "High",
  },
  {
    id: "ca-003",
    date: "2026-09-14",
    category: "Polity",
    title: "Supreme Court Ruling on Electoral Bonds",
    whyInNews: "The Supreme Court delivered a landmark judgment on the validity of the Electoral Bonds scheme.",
    summary: "The SC struck down the scheme citing violation of Right to Information (Article 19(1)(a)).",
    prelimsFacts: [
      "Electoral bonds were introduced in the Finance Bill, 2017.",
      "Only political parties registered under Section 29A of the RPA, 1951 were eligible.",
      "State Bank of India (SBI) was the only authorized bank to issue these bonds."
    ],
    staticConnection: "Polity → Elections → Funding",
    importance: "High",
  },
  {
    id: "ca-004",
    date: "2026-09-14",
    category: "Science & Tech",
    title: "ISRO's Gaganyaan Mission Preparations",
    whyInNews: "ISRO completed key tests for the crew escape system of the Gaganyaan mission.",
    summary: "Gaganyaan is India's first human spaceflight mission aiming to send a 3-member crew to a low earth orbit.",
    prelimsFacts: [
      "Launch vehicle being used is LVM3 (Launch Vehicle Mark-3).",
      "Vyommitra is the humanoid robot developed by ISRO to fly aboard unmanned missions.",
      "Mission is supported by Glavkosmos (Russia) for astronaut training."
    ],
    staticConnection: "Science & Tech → Space Technology",
    importance: "Medium",
  },
  {
    id: "ca-005",
    date: "2026-09-13",
    category: "International Relations",
    title: "G20 Summit Outcomes",
    whyInNews: "The recent G20 summit concluded with a joint declaration focusing on sustainable development.",
    summary: "The summit highlighted the need for reformed multilateralism and climate financing for developing nations.",
    prelimsFacts: [
      "G20 was founded in 1999 after the Asian financial crisis.",
      "The African Union recently became a permanent member of the G20.",
      "G20 does not have a permanent secretariat."
    ],
    staticConnection: "IR → Global Groupings",
    importance: "High",
  }
];
