export type SyllabusTopic = {
  id: string;
  title: string;
  notesAvailable?: boolean;
};

export type SyllabusChapter = {
  id: string;
  title: string;
  topics: SyllabusTopic[];
};

export type SyllabusSubject = {
  id: string;
  title: string;
  icon: string;
  chapters: SyllabusChapter[];
};

export const syllabusData: SyllabusSubject[] = [
  {
    id: "polity",
    title: "Indian Polity & Governance",
    icon: "🏛️",
    chapters: [
      {
        id: "polity-c1",
        title: "Constitutional Framework",
        topics: [
          { id: "polity-t1", title: "Historical Background", notesAvailable: true },
          { id: "polity-t2", title: "Making of the Constitution", notesAvailable: true },
          { id: "polity-t3", title: "Salient Features of the Constitution" },
          { id: "polity-t4", title: "Preamble of the Constitution", notesAvailable: true },
          { id: "polity-t5", title: "Union and its Territory" },
          { id: "polity-t6", title: "Citizenship" },
          { id: "polity-t7", title: "Fundamental Rights", notesAvailable: true },
          { id: "polity-t8", title: "Directive Principles of State Policy" },
          { id: "polity-t9", title: "Fundamental Duties" },
          { id: "polity-t10", title: "Amendment of the Constitution" },
        ],
      },
      {
        id: "polity-c2",
        title: "System of Government",
        topics: [
          { id: "polity-t11", title: "Parliamentary System" },
          { id: "polity-t12", title: "Federal System" },
          { id: "polity-t13", title: "Centre-State Relations" },
          { id: "polity-t14", title: "Inter-State Relations" },
          { id: "polity-t15", title: "Emergency Provisions" },
        ],
      },
      {
        id: "polity-c3",
        title: "Central Government",
        topics: [
          { id: "polity-t16", title: "President" },
          { id: "polity-t17", title: "Vice-President" },
          { id: "polity-t18", title: "Prime Minister" },
          { id: "polity-t19", title: "Central Council of Ministers" },
          { id: "polity-t20", title: "Parliament" },
          { id: "polity-t21", title: "Supreme Court" },
        ],
      }
    ],
  },
  {
    id: "history",
    title: "History of India",
    icon: "📜",
    chapters: [
      {
        id: "history-c1",
        title: "Ancient India",
        topics: [
          { id: "history-t1", title: "Prehistoric Period" },
          { id: "history-t2", title: "Indus Valley Civilization" },
          { id: "history-t3", title: "Vedic Period" },
          { id: "history-t4", title: "Jainism and Buddhism" },
          { id: "history-t5", title: "Mauryan Empire" },
        ],
      },
      {
        id: "history-c2",
        title: "Medieval India",
        topics: [
          { id: "history-t6", title: "Early Medieval Period" },
          { id: "history-t7", title: "Delhi Sultanate" },
          { id: "history-t8", title: "Mughal Empire" },
          { id: "history-t9", title: "Vijayanagara Empire" },
          { id: "history-t10", title: "Bhakti & Sufi Movements" },
        ],
      },
      {
        id: "history-c3",
        title: "Modern India",
        topics: [
          { id: "history-t11", title: "Advent of Europeans" },
          { id: "history-t12", title: "British Conquest of India" },
          { id: "history-t13", title: "Revolt of 1857" },
          { id: "history-t14", title: "Socio-Religious Reforms" },
          { id: "history-t15", title: "Indian National Movement" },
        ],
      }
    ],
  },
  {
    id: "geography",
    title: "Indian & World Geography",
    icon: "🌍",
    chapters: [
      {
        id: "geo-c1",
        title: "Physical Geography",
        topics: [
          { id: "geo-t1", title: "Geomorphology" },
          { id: "geo-t2", title: "Climatology" },
          { id: "geo-t3", title: "Oceanography" },
          { id: "geo-t4", title: "Biogeography" },
        ],
      },
      {
        id: "geo-c2",
        title: "Indian Geography",
        topics: [
          { id: "geo-t5", title: "Physical Features" },
          { id: "geo-t6", title: "Drainage System" },
          { id: "geo-t7", title: "Climate, Vegetation & Soil" },
          { id: "geo-t8", title: "Economic Geography" },
        ],
      }
    ]
  },
  {
    id: "economy",
    title: "Economic & Social Development",
    icon: "📈",
    chapters: [
      {
        id: "eco-c1",
        title: "Macroeconomics",
        topics: [
          { id: "eco-t1", title: "National Income Accounting" },
          { id: "eco-t2", title: "Money & Banking" },
          { id: "eco-t3", title: "Inflation & Employment" },
          { id: "eco-t4", title: "Government Budgeting" },
        ],
      },
      {
        id: "eco-c2",
        title: "Sectors of Economy",
        topics: [
          { id: "eco-t5", title: "Agriculture" },
          { id: "eco-t6", title: "Industry" },
          { id: "eco-t7", title: "Services" },
          { id: "eco-t8", title: "Infrastructure" },
        ],
      }
    ]
  }
];
