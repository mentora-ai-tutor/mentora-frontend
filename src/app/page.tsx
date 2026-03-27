import Link from "next/link";

export default function Home() {
  const components = [
    {
      name: "Knowledge Analysis",
      href: "/knowledge-analysis",
      developer: "Wijekoon K.S.M.",
      description: "Analyzes student knowledge patterns and learning data",
      color: "bg-blue-500",
    },
    {
      name: "Learning Generator",
      href: "/learning-generator",
      developer: "Jayarathna S.K.N.",
      description: "Generates personalized learning content",
      color: "bg-green-500",
    },
    {
      name: "Assessment Agent",
      href: "/assessment-agent",
      developer: "Weerasinghe D.I.",
      description: "AI-powered assessment and evaluation system",
      color: "bg-purple-500",
    },
    {
      name: "Peer Learning",
      href: "/peer-learning",
      developer: "Wahalathanthri H.C.",
      description: "Facilitates collaborative peer-to-peer learning",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <header className="border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Mentora Platform
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            AI-Powered Personalized Learning System
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-8">
          Project Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {components.map((component) => (
            <Link
              key={component.href}
              href={component.href}
              className="group block p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-3 h-3 rounded-full ${component.color}`}
                />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {component.name}
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {component.description}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Developer: {component.developer}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
