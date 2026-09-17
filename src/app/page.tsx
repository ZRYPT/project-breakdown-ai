"use client";

import { useState } from "react";
import { ProjectBreakdown } from "@/types/project";

export default function Home() {
  const [projectInput, setProjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectBreakdown | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectInput) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: projectInput }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to fetch response");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center">Project Breakdown Generator</h1>

      <form onSubmit={handleAnalyze} className="flex gap-4 max-w-xl mx-auto">
        <input
          type="text"
          value={projectInput}
          onChange={(e) => setProjectInput(e.target.value)}
          placeholder="Enter a project (e.g., YouTube)"
          className="flex-1 p-3 border border-gray-600 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md disabled:bg-gray-500 transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 border border-gray-700 p-6 rounded-lg bg-gray-900 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">{result.name}</h2>
            <p className="text-gray-300 mt-1">{result.description}</p>
          </div>

          <div className="space-y-4">
            {result.systems.map((sys, idx) => (
              <details key={idx} open className="border-l-2 border-blue-500 pl-4 py-2">
                <summary className="font-semibold text-lg cursor-pointer text-blue-300">
                  {sys.name} - <span className="text-sm font-normal text-gray-400">{sys.description}</span>
                </summary>
                
                <div className="mt-3 ml-4 space-y-4">
                  {sys.components.map((comp, cIdx) => (
                    <div key={cIdx} className="bg-gray-800 p-4 rounded-md space-y-2 border border-gray-700">
                      <h4 className="font-bold text-yellow-400 text-base">{comp.name}</h4>
                      <p className="text-sm text-gray-300">{comp.explanation}</p>
                      
                      <div className="flex gap-2 flex-wrap text-xs pt-1">
                        {comp.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 space-y-2">
                        {comp.steps.map((step, sIdx) => (
                          <div key={sIdx} className="text-xs bg-gray-700/60 p-3 rounded border border-gray-600">
                            <span className="font-semibold block text-gray-200">{step.title}</span>
                            <p className="text-gray-300 mt-0.5">{step.explanation}</p>
                            {step.code && (
                              <pre className="bg-black/80 p-2.5 rounded mt-2 overflow-x-auto text-green-400 font-mono text-xs border border-gray-800">
                                <code>{step.code}</code>
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}