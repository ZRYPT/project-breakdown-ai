"use client";

import { useState } from "react";
import Link from "next/link";

interface SubComponent {
  name: string;
  description: string;
  components: string[];
}

const mockBreakdownData: Record<string, SubComponent[]> = {
  default: [
    {
      name: "User System",
      description: "Responsible for managing user profiles, authentication, and sessions.",
      components: ["Auth", "Profile Storage", "Session Token", "Permissions"],
    },
    {
      name: "Video System",
      description: "Responsible for handling videos.",
      components: ["Upload", "Storage", "Processing", "Thumbnail", "Video Player"],
    },
    {
      name: "Search System",
      description: "Responsible for indexing content and serving fast query results.",
      components: ["Indexer", "Query Engine", "Filters", "Autocomplete"],
    },
    {
      name: "Comment System",
      description: "Responsible for discussion threads and user reactions.",
      components: ["Post Comment", "Nested Replies", "Moderation API", "Likes"],
    },
    {
      name: "Subscription System",
      description: "Responsible for managing creator subscriptions and notifications.",
      components: ["Subscriber DB", "Notification Trigger", "Billing Integration"],
    },
    {
      name: "Recommendation System",
      description: "Responsible for personalized content feeds.",
      components: ["User Analytics", "ML Ranker", "Feed Generator"],
    },
  ],
};

export default function AnalyzePage() {
  const [platform, setPlatform] = useState("");
  const [analyzedPlatform, setAnalyzedPlatform] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SubComponent | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform.trim()) {
      setAnalyzedPlatform(platform);
      setSelectedSystem(mockBreakdownData.default[1]); // Default to 'Video System'
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 py-12">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-slate-200 transition-colors inline-block"
        >
          ← Back to Home
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Analyze Existing Platform
          </h1>
          <p className="text-sm text-slate-400">
            Enter the name of a platform or app you want to study.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter a platform:
            </label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. YouTube"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Analyze
          </button>
        </form>

        {analyzedPlatform && (
          <div className="mt-8 space-y-6 border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold text-white">{analyzedPlatform}</h2>

            <div className="font-mono text-sm space-y-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-400">|</p>
              {mockBreakdownData.default.map((sys, idx) => {
                const isLast = idx === mockBreakdownData.default.length - 1;
                const isSelected = selectedSystem?.name === sys.name;
                return (
                  <div key={sys.name} className="flex items-center">
                    <span className="text-slate-600 mr-2">
                      {isLast ? "└─" : "├─"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSystem(sys)}
                      className={`text-left hover:underline ${
                        isSelected
                          ? "text-blue-400 font-bold"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {sys.name}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedSystem && (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
                <h3 className="text-lg font-bold text-white">
                  {selectedSystem.name}
                </h3>
                <p className="text-sm text-slate-300">
                  {selectedSystem.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Components:
                  </h4>
                  <div className="font-mono text-xs space-y-1 pl-2">
                    {selectedSystem.components.map((comp, idx) => {
                      const isLastComp =
                        idx === selectedSystem.components.length - 1;
                      return (
                        <div key={comp} className="flex items-center text-slate-400">
                          <span className="text-slate-600 mr-2">
                            {isLastComp ? "└─" : "├─"}
                          </span>
                          <span>{comp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}