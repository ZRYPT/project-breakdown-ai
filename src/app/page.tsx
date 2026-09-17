"use client";

import { useState } from "react";

export default function Home() {
  const [projectInput, setProjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [actionResults, setActionResults] = useState<{ [key: string]: any }>({});

  const handleAnalyze = async () => {
    if (!projectInput) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: projectInput }),
      });
      const data = await res.json();
      if (data.success) {
        setProjectData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentAction = async (componentName: string, actionType: string) => {
    setActionLoading((prev) => ({ ...prev, [componentName]: true }));
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentName, action: actionType }),
      });
      const data = await res.json();
      if (data.success) {
        setActionResults((prev) => ({ ...prev, [componentName]: data.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [componentName]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Project Breakdown Generator</h1>
        
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            placeholder="Enter project idea..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {projectData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">{projectData.name}</h2>
            <p className="text-slate-300">{projectData.description}</p>

            {projectData.systems?.map((sys: any, sysIdx: number) => (
              <details key={sysIdx} open className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4">
                <summary className="cursor-pointer font-bold text-lg text-emerald-400">
                  {sys.name} <span className="text-slate-400 text-sm font-normal">- {sys.description}</span>
                </summary>

                <div className="mt-4 space-y-4">
                  {sys.components?.map((comp: any, compIdx: number) => (
                    <div key={compIdx} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <h4 className="text-md font-bold text-amber-400">{comp.name}</h4>
                      <p className="text-xs text-slate-300 my-1">{comp.explanation}</p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 my-2">
                        {comp.technologies?.map((tech: string, tIdx: number) => (
                          <span key={tIdx} className="bg-slate-800 text-blue-300 text-xs px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Code Steps */}
                      {comp.steps?.map((step: any, sIdx: number) => (
                        <div key={sIdx} className="mt-3">
                          <h5 className="text-xs font-semibold text-slate-200">{step.title}</h5>
                          <p className="text-xs text-slate-400 mb-1">{step.explanation}</p>
                          {step.code && (
                            <pre className="bg-slate-900 text-green-400 text-xs p-3 rounded overflow-x-auto border border-slate-800">
                              <code>{step.code}</code>
                            </pre>
                          )}
                        </div>
                      ))}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
                        <button
                          onClick={() => handleComponentAction(comp.name, "explain")}
                          disabled={actionLoading[comp.name]}
                          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                        >
                          [ Explain ]
                        </button>
                        <button
                          onClick={() => handleComponentAction(comp.name, "breakdown")}
                          disabled={actionLoading[comp.name]}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition"
                        >
                          [ Break Down ]
                        </button>
                        <button
                          onClick={() => handleComponentAction(comp.name, "show_code")}
                          disabled={actionLoading[comp.name]}
                          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                        >
                          [ Show Code ]
                        </button>
                        <button
                          onClick={() => handleComponentAction(comp.name, "next_step")}
                          disabled={actionLoading[comp.name]}
                          className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                        >
                          [ Next Step ]
                        </button>
                      </div>

                      {/* Action Loading Status */}
                      {actionLoading[comp.name] && (
                        <p className="text-xs text-blue-400 animate-pulse mt-2">Generating breakdown details...</p>
                      )}

                      {/* Phase 14 Explanation Output Card */}
                      {actionResults[comp.name] && !actionLoading[comp.name] && (
                        <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4 text-slate-200">
                          {actionResults[comp.name].whatIsIt && (
                            <div>
                              <h5 className="font-bold text-slate-100 text-sm mb-1">What is it?</h5>
                              <p className="text-xs text-slate-300">{actionResults[comp.name].whatIsIt}</p>
                            </div>
                          )}

                          {actionResults[comp.name].whyDoWeNeedIt && (
                            <div>
                              <h5 className="font-bold text-slate-100 text-sm mb-1">Why do we need it?</h5>
                              <p className="text-xs text-slate-300">{actionResults[comp.name].whyDoWeNeedIt}</p>
                            </div>
                          )}

                          {actionResults[comp.name].howDoesItWork?.length > 0 && (
                            <div>
                              <h5 className="font-bold text-slate-100 text-sm mb-1">How does it work?</h5>
                              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                                {actionResults[comp.name].howDoesItWork.map((step: string, idx: number) => (
                                  <li key={idx}>{step.replace(/^\d+\.\s*/, "")}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Metadata Box */}
                          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                            {actionResults[comp.name].difficulty && (
                              <p><strong className="text-slate-200">Difficulty:</strong> {actionResults[comp.name].difficulty}</p>
                            )}
                            {actionResults[comp.name].prerequisites?.length > 0 && (
                              <div>
                                <strong className="text-slate-200">Prerequisites:</strong>
                                <ul className="list-disc list-inside ml-2">
                                  {actionResults[comp.name].prerequisites.map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Follow-up input */}
                          <div className="pt-2">
                            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-400 focus-within:border-blue-500">
                              <span className="mr-2 text-slate-500">+</span>
                              <input
                                type="text"
                                placeholder="Ask anything"
                                className="bg-transparent flex-1 text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}