import { useLocalStorage } from "./useLocalStorage";

export interface ProgressState {
  caRead: string[]; // array of CA ids read
  mcqsDone: string[]; // array of MCQ ids done
  revisionDone: string[]; // array of Revision ids done
  lastUpdated: string; // YYYY-MM-DD
}

export function useProgress() {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [progress, setProgress] = useLocalStorage<ProgressState>("upsc_progress", {
    caRead: [],
    mcqsDone: [],
    revisionDone: [],
    lastUpdated: getTodayStr(),
  });

  // Reset progress if it's a new day
  if (progress.lastUpdated !== getTodayStr()) {
    setProgress({
      caRead: [],
      mcqsDone: [],
      revisionDone: [],
      lastUpdated: getTodayStr(),
    });
  }

  const markCaRead = (id: string) => {
    if (!progress.caRead.includes(id)) {
      setProgress((prev) => ({ ...prev, caRead: [...prev.caRead, id] }));
    }
  };

  const markMcqDone = (id: string) => {
    if (!progress.mcqsDone.includes(id)) {
      setProgress((prev) => ({ ...prev, mcqsDone: [...prev.mcqsDone, id] }));
    }
  };

  const markRevisionDone = (id: string) => {
    if (!progress.revisionDone.includes(id)) {
      setProgress((prev) => ({ ...prev, revisionDone: [...prev.revisionDone, id] }));
    }
  };
  
  const isRevisionDone = (id: string) => progress.revisionDone.includes(id);

  return { progress, markCaRead, markMcqDone, markRevisionDone, isRevisionDone };
}
