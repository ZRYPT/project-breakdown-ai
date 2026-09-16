"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [platform, setPlatform] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform.trim()) {
      setResult(platform);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
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

        {result && (
          <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
            <h3 className="text-xl font-bold text-blue-400">{result}</h3>
            <p className="text-xs text-slate-500 font-mono">No AI yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}