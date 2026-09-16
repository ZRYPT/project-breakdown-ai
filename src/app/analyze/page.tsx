"use client";

import { useState } from "react";
import Link from "next/link";

interface SubComponent {
  name: string;
  description: string;
  components: string[];
}

export default function AnalyzePage() {
  const [platform, setPlatform] = useState("");
  const [analyzedPlatform, setAnalyzedPlatform] = useState<string | null>(null);
  const [systems, setSystems] = useState<SubComponent[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<SubComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim()) return;

    setLoading(true);
    setError(null);
    setAnalyzedPlatform(null);
    setSystems([]);
    setSelectedSystem(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (!res.ok) throw new Error("Failed to generate breakdown");

      const data = await res.json();
      setSystems(data.systems || []);
      setAnalyzedPlatform(platform);
      if (data.systems && data.systems.length > 0) {
        setSelectedSystem(data.systems[0]);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
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
            Enter the name of a platform or app to generate a real-time AI breakdown.
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
              placeholder="e.g. Spotify, Netflix, Twitter"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center"
          >
            {loading ? "Analyzing Platform..." : "Analyze"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 p-3 border border-red-800 rounded-lg">
            {error}
          </p>
        )}

        {analyzedPlatform && systems.length > 0 && (
          <div className="mt-8 space-y-6 border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold text-white">{analyzedPlatform}</h2>

            <div className="font-mono text-sm space-y-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-400">|</p>
              {systems.map((sys, idx) => {
                const isLast = idx === systems.length - 1;
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