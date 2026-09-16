import { NextResponse } from "next/server";
import { summarizeNewsForUPSC, generateMCQForUPSC } from "@/lib/gemini";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { fetchAllHeadlines } from "@/lib/sources";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch from ALL 10 sources
    const allNews = await fetchAllHeadlines();
    
    // 2. Pick top 10 most important
    const shuffled = allNews.sort(() => 0.5 - Math.random());
    const top10News = shuffled.slice(0, 10);

    const processedItems = [];

    // 3. Process the top 10 items in parallel (Promise.all) to save time
    await Promise.all(top10News.map(async (item) => {
      const rawText = `Source: ${item.source}\nTitle: ${item.title}\n\n${item.content}`;
      
      const summary = await summarizeNewsForUPSC(rawText);
      if (summary) {
        const currentAffair = {
          ...summary,
          date: new Date().toISOString().split("T")[0],
          timestamp: Date.now(),
        };

        const caRef = await addDoc(collection(db, "currentAffairs"), currentAffair);
        
        const mcqStr = `Title: ${summary.title}\nSummary: ${summary.summary}\nFacts: ${summary.prelimsFacts.join(", ")}`;
        const mcq = await generateMCQForUPSC(mcqStr);
        
        if (mcq) {
          await addDoc(collection(db, "mcqs"), {
            ...mcq,
            caId: caRef.id,
            date: currentAffair.date,
            timestamp: currentAffair.timestamp,
          });
        }
        
        if (summary.prelimsFacts.length > 0) {
          await addDoc(collection(db, "revision"), {
            category: summary.category,
            fact: summary.prelimsFacts[0],
            relatedTopic: summary.title,
            caId: caRef.id,
            date: currentAffair.date,
            timestamp: currentAffair.timestamp,
          });
        }
        
        processedItems.push(currentAffair.title);
      }
    }));

    return NextResponse.json({
      success: true,
      message: `Processed ${processedItems.length} news items from across 10 official sources.`,
      items: processedItems,
    });
  } catch (error) {
    console.error("Error in generate-daily route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
