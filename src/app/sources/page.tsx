"use client";

import { OFFICIAL_SOURCES } from "@/lib/sources";
import { ExternalLink, Globe } from "lucide-react";

export default function SourcesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-[var(--color-plum)] mb-2 tracking-tight">
          Official Sources
        </h1>
        <p className="text-sm text-gray-600">
          Direct access to all government and official websites monitored daily.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {OFFICIAL_SOURCES.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-pink-100/50 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-blush-soft)] rounded-full text-pink-500 group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-plum)] text-sm group-hover:text-pink-600 transition-colors">
                    {source.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                    {new URL(source.url).hostname.replace('www.', '')}
                  </p>
                </div>
              </div>
              <ExternalLink size={16} className="text-gray-300 group-hover:text-pink-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
