"use client";

import { useState } from "react";
import Link from "next/link";

const mockIdeaBreakdown = [
  "Authentication",
  "Dashboard",
  "Speaking",
  "Writing",
  "Reading",
  "Listening",
  "AI Evaluation Engine",
  "Progress Tracking",
];

export default function IdeaPage() {
  const [ideaText, setIdeaText] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ideaText.trim()) {
      setShowBreakdown(true);
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
            Build My Idea
          </h1>
          <p className="text-sm text-slate-400">
            Describe your project idea to generate a structured feature blueprint.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Describe your idea:
            </label>
            <textarea
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="I want to create an AI IELTS app for students..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Break Down My Idea
          </button>
        </form>

        {showBreakdown && (
          <div className="mt-8 space-y-4 border-t border-slate-800 pt-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-emerald-400">Your Project</h2>

            <div className="font-mono text-sm space-y-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-400">|</p>
              {mockIdeaBreakdown.map((item, idx) => {
                const isLast = idx === mockIdeaBreakdown.length - 1;
                return (
                  <div key={item} className="flex items-center text-slate-300">
                    <span className="text-slate-600 mr-2">
                      {isLast ? "└─" : "├─"}
                    </span>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}