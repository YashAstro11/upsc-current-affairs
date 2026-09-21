export interface NoteContent {
  id: string;
  topicId: string; // References SyllabusTopic.id
  title: string;
  content: string; // HTML or Markdown string for rich text
}

export const notesData: Record<string, NoteContent> = {
  "polity-t1": {
    id: "n-polity-t1",
    topicId: "polity-t1",
    title: "Historical Background of the Constitution",
    content: `
      <h2>The Company Rule (1773-1858)</h2>
      <p>The British East India Company arrived in India in 1600 as traders but eventually acquired territorial power.</p>
      
      <h3>1. Regulating Act of 1773</h3>
      <ul>
        <li>First step by the British Parliament to control and regulate the affairs of the East India Company.</li>
        <li>Designated the Governor of Bengal as the 'Governor-General of Bengal' (Lord Warren Hastings).</li>
        <li>Created an Executive Council of four members to assist him.</li>
        <li>Provided for the establishment of a Supreme Court at Calcutta (1774).</li>
      </ul>

      <h3>2. Pitt’s India Act of 1784</h3>
      <ul>
        <li>Distinguished between commercial and political functions of the Company.</li>
        <li>Established a system of double government: Board of Control for political affairs, Court of Directors for commercial affairs.</li>
      </ul>

      <h3>3. Charter Act of 1833</h3>
      <ul>
        <li>Made the Governor-General of Bengal the 'Governor-General of India' (Lord William Bentinck).</li>
        <li>Deprived the Governor of Bombay and Madras of their legislative powers.</li>
        <li>Attempted to introduce a system of open competition for selection of civil servants (failed).</li>
      </ul>

      <h2>The Crown Rule (1858-1947)</h2>
      
      <h3>1. Government of India Act of 1858</h3>
      <ul>
        <li>Enacted in the wake of the Revolt of 1857.</li>
        <li>Abolished the East India Company and transferred powers directly to the British Crown.</li>
        <li>Changed the designation of the Governor-General to 'Viceroy of India' (Lord Canning).</li>
      </ul>
      
      <h3>2. Indian Councils Act of 1861, 1892, and 1909</h3>
      <ul>
        <li><strong>1861:</strong> Initiated the process of decentralization.</li>
        <li><strong>1892:</strong> Increased the number of additional members in the Central and provincial legislative councils.</li>
        <li><strong>1909 (Morley-Minto Reforms):</strong> Introduced a system of communal representation for Muslims by accepting the concept of a 'separate electorate'.</li>
      </ul>
    `
  },
  "polity-t2": {
    id: "n-polity-t2",
    topicId: "polity-t2",
    title: "Making of the Constitution",
    content: `
      <h2>Constituent Assembly</h2>
      <p>The idea of a Constituent Assembly for India was put forward for the first time by M.N. Roy in 1934.</p>
      <ul>
        <li><strong>Composition:</strong> Formed in November 1946 under the scheme formulated by the Cabinet Mission Plan.</li>
        <li><strong>Total Strength:</strong> Originally 389, reduced to 299 after the partition of India.</li>
        <li><strong>First Meeting:</strong> Held on December 9, 1946. Dr. Sachchidananda Sinha was elected as the temporary President.</li>
        <li><strong>Permanent President:</strong> Dr. Rajendra Prasad was elected on December 11, 1946.</li>
      </ul>
      
      <h3>Objective Resolution</h3>
      <p>Moved by Jawaharlal Nehru on December 13, 1946. It laid down the fundamentals and philosophy of the constitutional structure.</p>
      
      <h3>Drafting Committee</h3>
      <p>Set up on August 29, 1947, it was the most important committee. It consisted of seven members, chaired by Dr. B.R. Ambedkar.</p>
      
      <h2>Enactment and Enforcement</h2>
      <ul>
        <li>The Constitution was adopted on <strong>November 26, 1949</strong> (contained a Preamble, 395 Articles, and 8 Schedules).</li>
        <li>It came into force on <strong>January 26, 1950</strong> (Republic Day), chosen to commemorate the Purna Swaraj declaration of 1930.</li>
      </ul>
    `
  }
};
