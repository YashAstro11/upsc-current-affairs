import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { summarizeNewsForUPSC, generateMCQForUPSC } from "@/lib/gemini";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const parser = new Parser({
  customFields: {
    item: ['description']
  },
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }
});

// Top sources for UPSC
const RSS_FEEDS = [
  "https://www.thehindu.com/news/national/feeder/default.rss",
  "https://indianexpress.com/section/india/feed/",
];

export async function GET(request: Request) {
  // Simple auth check so anyone can't hit this route
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allNews = [];
    
    // Fetch top 2 news items from each feed
    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      allNews.push(...feed.items.slice(0, 2));
    }

    const processedItems = [];

    // Process each news item
    for (const item of allNews) {
      const rawText = `${item.title}\n\n${item.contentSnippet || item.content}`;
      
      const summary = await summarizeNewsForUPSC(rawText);
      if (summary) {
        // Add ID and date
        const currentAffair = {
          ...summary,
          date: new Date().toISOString().split("T")[0],
          timestamp: Date.now(),
        };

        // Save Current Affair to Firestore
        const caRef = await addDoc(collection(db, "currentAffairs"), currentAffair);
        
        // Generate MCQ based on summary
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
        
        // Save first fact as Revision Fact
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
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedItems.length} news items.`,
      items: processedItems,
    });
  } catch (error) {
    console.error("Error in generate-daily route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
