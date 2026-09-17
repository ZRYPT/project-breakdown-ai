"use client";

import { useState } from "react";

// Add this ComponentCard component or inline it inside your map loop
function ComponentCard({ component }: { component: any }) {
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAction = async (actionType: string) => {
    setLoading(true);
    setActiveAction(actionType);
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentName: component.name, action: actionType }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 my-3">
        <button
          onClick={() => handleAction("explain")}
          disabled={loading}
          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition disabled:opacity-50"
        >
          [ Explain ]
        </button>
        <button
          onClick={() => handleAction("breakdown")}
          disabled={loading}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition disabled:opacity-50"
        >
          [ Break Down ]
        </button>
        <button
          onClick={() => handleAction("show_code")}
          disabled={loading}
          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition disabled:opacity-50"
        >
          [ Show Code ]
        </button>
        <button
          onClick={() => handleAction("next_step")}
          disabled={loading}
          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition disabled:opacity-50"
        >
          [ Next Step ]
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-xs text-blue-400 animate-pulse my-2">
          Generating {activeAction} response...
        </p>
      )}

      {/* Dynamic Breakdown Display */}
      {result && !loading && (
        <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-950 p-3 rounded">
          <h5 className="font-semibold text-sm text-green-400">{result.title}</h5>
          <p className="text-xs text-slate-300 my-2">{result.details}</p>

          {result.subComponents && result.subComponents.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Sub-Components:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {result.subComponents.map((sub: string, idx: number) => (
                  <li key={idx} className="hover:text-blue-300 transition">
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.codeSnippet && (
            <pre className="mt-3 p-3 bg-slate-900 text-green-300 text-xs rounded overflow-x-auto border border-slate-800">
              <code>{result.codeSnippet}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}