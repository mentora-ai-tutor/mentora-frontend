import Link from "next/link";

export default function MentoraLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: "w-8 h-8 text-base", text: "text-xl", dot: "w-1.5 h-1.5" },
    md: { icon: "w-10 h-10 text-lg", text: "text-2xl", dot: "w-2 h-2" },
    lg: { icon: "w-14 h-14 text-2xl", text: "text-3xl", dot: "w-2.5 h-2.5" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-3 group w-fit">
      {/* Icon mark */}
      <div
        className={`${s.icon} relative flex items-center justify-center rounded-2xl font-bold text-white shadow-lg
        bg-gradient-to-br from-teal-500 to-teal-700
        group-hover:shadow-teal-500/40 group-hover:scale-105 transition-all duration-300`}
      >
        <span>M</span>
        {/* accent dot */}
        <span
          className={`absolute -top-0.5 -right-0.5 ${s.dot} rounded-full bg-amber-400 shadow-sm
          group-hover:scale-125 transition-transform duration-300`}
        />
      </div>

      {/* Wordmark */}
      <span
        className={`${s.text} font-black tracking-tight text-white
        bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent`}
      >
        mentora
      </span>
    </Link>
  );
}
