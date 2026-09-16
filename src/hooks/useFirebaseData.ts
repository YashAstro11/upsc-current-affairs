import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CurrentAffair } from "@/data/currentAffairs";
import { MCQ } from "@/data/mcqs";
import { RevisionFact } from "@/data/revision";

export function useFirebaseData() {
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [revisionFacts, setRevisionFacts] = useState<RevisionFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const caSnapshot = await getDocs(query(collection(db, "currentAffairs"), orderBy("timestamp", "desc"), limit(20)));
        const mcqSnapshot = await getDocs(query(collection(db, "mcqs"), orderBy("timestamp", "desc"), limit(20)));
        const revSnapshot = await getDocs(query(collection(db, "revision"), orderBy("timestamp", "desc"), limit(20)));

        setCurrentAffairs(caSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CurrentAffair)));
        setMcqs(mcqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MCQ)));
        setRevisionFacts(revSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RevisionFact)));
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { currentAffairs, mcqs, revisionFacts, loading };
}
