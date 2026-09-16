import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CurrentAffair, currentAffairsData as staticCa } from "@/data/currentAffairs";
import { MCQ, mcqsData as staticMcqs } from "@/data/mcqs";
import { RevisionFact, revisionData as staticRev } from "@/data/revision";

// Ensure we always have 10 items by duplicating if necessary
const getAtLeast10 = (arr: any[], staticFallback: any[]) => {
  let source = arr.length > 0 ? arr : staticFallback;
  if (source.length === 0) return [];
  
  const result = [...source];
  let counter = 2;
  while (result.length < 10) {
    source.forEach(x => {
      result.push({ ...x, id: x.id + '-' + counter });
    });
    counter++;
  }
  return result.slice(0, 10);
};

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

  return { 
    currentAffairs: getAtLeast10(currentAffairs, staticCa), 
    mcqs: getAtLeast10(mcqs, staticMcqs), 
    revisionFacts: getAtLeast10(revisionFacts, staticRev), 
    loading 
  };
}
