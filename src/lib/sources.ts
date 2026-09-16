import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

export interface SourceInfo {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'scrape';
  feedUrl?: string;
}

export interface NewsItem {
  title: string;
  content: string;
  source: string;
}

const parser = new Parser({
  customFields: {
    item: ['description']
  },
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  }
});

export const OFFICIAL_SOURCES: SourceInfo[] = [
  {
    id: 'pib',
    name: 'Press Information Bureau (PIB)',
    url: 'https://pib.gov.in',
    type: 'rss',
    feedUrl: 'https://pib.gov.in/rss/MainFeatures.xml'
  },
  {
    id: 'rbi',
    name: 'Reserve Bank of India (RBI)',
    url: 'https://rbi.org.in',
    type: 'rss',
    feedUrl: 'https://rbi.org.in/home.aspx' // Note: RBI RSS is actually at https://www.rbi.org.in/Scripts/bs_viewcontent.aspx?Id=120
  },
  {
    id: 'isro',
    name: 'ISRO',
    url: 'https://www.isro.gov.in',
    type: 'scrape',
  },
  {
    id: 'drdo',
    name: 'DRDO',
    url: 'https://www.drdo.gov.in',
    type: 'scrape',
  },
  {
    id: 'csir',
    name: 'CSIR',
    url: 'https://www.csir.res.in',
    type: 'scrape',
  },
  {
    id: 'culture',
    name: 'Ministry of Culture',
    url: 'https://indiaculture.gov.in',
    type: 'scrape',
  },
  {
    id: 'niti',
    name: 'NITI Aayog',
    url: 'https://www.niti.gov.in',
    type: 'scrape',
  },
  {
    id: 'sansad',
    name: 'Sansad TV',
    url: 'https://sansadtv.nic.in',
    type: 'scrape',
  },
  {
    id: 'thehindu',
    name: 'The Hindu',
    url: 'https://www.thehindu.com',
    type: 'rss',
    feedUrl: 'https://www.thehindu.com/news/national/feeder/default.rss'
  },
  {
    id: 'indianexpress',
    name: 'The Indian Express',
    url: 'https://indianexpress.com',
    type: 'rss',
    feedUrl: 'https://indianexpress.com/section/india/feed/'
  }
];

// Helper to fetch from RSS
async function fetchRss(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, 3).map(item => ({
      title: item.title || '',
      content: item.contentSnippet || item.content || '',
      source: sourceName
    }));
  } catch (e) {
    console.error(`Failed to fetch RSS for ${sourceName}`, e);
    return [];
  }
}

// Helper to fetch via basic scraping (simulated generic scraper for MVP)
async function fetchScrape(url: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const items: NewsItem[] = [];
    
    // Attempt to grab generic heading elements as news for these varied sources
    $('h1, h2, h3').slice(0, 3).each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        items.push({
          title: text,
          content: 'Read full update on official website.',
          source: sourceName
        });
      }
    });
    
    return items;
  } catch (e) {
    console.error(`Failed to scrape ${sourceName}`, e);
    return [];
  }
}

export async function fetchAllHeadlines(): Promise<NewsItem[]> {
  const promises = OFFICIAL_SOURCES.map(source => {
    if (source.type === 'rss' && source.feedUrl) {
      return fetchRss(source.feedUrl, source.name);
    } else {
      return fetchScrape(source.url, source.name);
    }
  });

  const results = await Promise.all(promises);
  return results.flat().filter(item => item.title && item.title.length > 15);
}
