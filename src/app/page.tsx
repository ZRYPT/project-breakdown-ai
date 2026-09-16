import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            ProjectBreakdown
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Understand. Break. Build.
          </p>
        </div>

        {/* Subheading Prompt */}
        <div className="py-2">
          <h2 className="text-lg sm:text-xl text-slate-300">
            What do you want to do?
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/25"
          >
            Analyze Existing
          </Link>
          
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            OR
          </span>

          <Link
            href="/idea"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg hover:shadow-emerald-500/25"
          >
            Build My Idea
          </Link>
        </div>
      </div>
    </main>
  );
}