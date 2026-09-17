"use client";

import { useState } from "react";

export default function Home() {
  const [projectInput, setProjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [actionResults, setActionResults] = useState<{ [key: string]: any }>({});

  const handleAnalyze = async () => {
    if (!projectInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: projectInput }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProjectData(data.data);
      } else {
        alert(`API Error: ${data.error || "Failed to analyze project"}`);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Network request failed. Check terminal console.");
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
            placeholder="Enter project idea or feature description..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {projectData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">{projectData.name || "Architecture Overview"}</h2>
            <p className="text-slate-300">{projectData.description}</p>

            {/* Phase 21: Add Accounts & Dashboard Section */}
            {projectData.accountAndDashboard && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-emerald-400">Add Accounts & Dashboard</h3>
                
                {/* Workflow steps */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Authentication Flow:</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    {projectData.accountAndDashboard.flow?.map((step: string, fIdx: number, arr: any[]) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-blue-300">
                          {step}
                        </span>
                        {fIdx < arr.length - 1 && <span className="text-slate-500">↓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard Sample Projects */}
                <div className="pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">The dashboard could show:</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                    <div className="text-sm font-bold text-slate-200">My Projects</div>
                    <div className="space-y-2">
                      {projectData.accountAndDashboard.sampleProjects?.map((proj: any, pIdx: number) => (
                        <div key={pIdx} className="border border-dashed border-slate-700 rounded p-3 bg-slate-900/50 space-y-1">
                          <div className="text-xs font-semibold text-blue-400">{proj.title}</div>
                          <div className="text-xs text-slate-400">{proj.progress}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technology Recommendations Section */}
            {projectData.technologyRecommendations && projectData.technologyRecommendations.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">Recommended Technology Stack</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectData.technologyRecommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded p-3 space-y-1">
                      <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                        {rec.category}
                      </div>
                      <div className="text-sm font-bold text-blue-400">
                        → {rec.technology}
                      </div>
                      <p className="text-xs text-slate-300 pt-1">
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supabase Database Architecture Section */}
            {projectData.supabaseArchitecture && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-emerald-400">Add Supabase Database Architecture</h3>
                <p className="text-xs text-slate-400">Once the core application works, add a database.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Supabase can handle:</h4>
                    <ul className="text-xs text-slate-200 space-y-1 font-mono">
                      {projectData.supabaseArchitecture.handledEntities?.map((entity: string, eIdx: number) => (
                        <li key={eIdx}>• {entity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Your database might eventually look like:</h4>
                    <ul className="text-xs text-emerald-400 space-y-1 font-mono">
                      {projectData.supabaseArchitecture.suggestedTables?.map((table: string, tIdx: number) => (
                        <li key={tIdx}>📁 {table}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {projectData.supabaseArchitecture.advice && (
                  <p className="text-xs text-amber-400 italic pt-2 border-t border-slate-800">
                    💡 {projectData.supabaseArchitecture.advice}
                  </p>
                )}
              </div>
            )}

            {/* Systems & Components Loop */}
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

                      <div className="flex flex-wrap gap-2 my-2">
                        {comp.technologies?.map((tech: string, tIdx: number) => (
                          <span key={tIdx} className="bg-slate-800 text-blue-300 text-xs px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Difficulty, Prerequisites & Learning Time */}
                      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs bg-slate-900/50 p-3 rounded">
                        {comp.difficulty && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold">Difficulty:</span>
                            <span className="text-amber-400 font-bold tracking-widest">{comp.difficulty}</span>
                          </div>
                        )}

                        {comp.prerequisites && comp.prerequisites.length > 0 && (
                          <div>
                            <span className="text-slate-400 font-semibold">Prerequisites:</span>
                            <ul className="text-slate-300 mt-1 space-y-0.5">
                              {comp.prerequisites.map((req: string, rIdx: number) => (
                                <li key={rIdx} className="flex items-center gap-1.5">
                                  <span className="text-emerald-400">✓</span> {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {comp.estimatedLearningTime && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-slate-400 font-semibold">Estimated learning:</span>
                            <span className="text-slate-200">{comp.estimatedLearningTime}</span>
                          </div>
                        )}
                      </div>

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
                      </div>

                      {actionLoading[comp.name] && (
                        <p className="text-xs text-blue-400 animate-pulse mt-2">Generating details...</p>
                      )}

                      {actionResults[comp.name] && !actionLoading[comp.name] && (
                        <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4 text-slate-200">
                          {actionResults[comp.name].whatIsIt && (
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-bold text-slate-100 text-sm mb-1">What is it?</h5>
                                <p className="text-xs text-slate-300">{actionResults[comp.name].whatIsIt}</p>
                              </div>
                              {actionResults[comp.name].whyDoWeNeedIt && (
                                <div>
                                  <h5 className="font-bold text-slate-100 text-sm mb-1">Why do we need it?</h5>
                                  <p className="text-xs text-slate-300">{actionResults[comp.name].whyDoWeNeedIt}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {actionResults[comp.name].steps?.length > 0 && (
                            <div className="space-y-6">
                              {actionResults[comp.name].steps.map((step: any, sIdx: number) => (
                                <div key={sIdx} className="space-y-2">
                                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                    STEP {step.stepNumber || sIdx + 1}
                                  </div>
                                  <p className="text-xs font-medium text-slate-200">{step.title}</p>
                                  <pre className="bg-slate-950 text-emerald-400 text-xs p-3 rounded overflow-x-auto border border-slate-800 font-mono">
                                    <code>{step.code}</code>
                                  </pre>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}

            {/* Development Roadmap / Build Order Section */}
            {projectData.developmentRoadmap && projectData.developmentRoadmap.length > 0 && (
              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">BUILD ORDER</h3>
                <div className="space-y-4">
                  {projectData.developmentRoadmap.map((step: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-4 py-1">
                      <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                        STEP {step.stepNumber || idx + 1}
                      </div>
                      <h4 className="text-md font-semibold text-slate-100">{step.title}</h4>
                      {step.description && (
                        <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}