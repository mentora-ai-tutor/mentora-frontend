export default function PeerLearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <header className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Peer Learning
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Developer: Wahalathanthri H.C.
          </p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Component Overview
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            This component facilitates collaborative peer-to-peer learning.
            Implementation coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
