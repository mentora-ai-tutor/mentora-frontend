import Image from "next/image";

export default function MentoraLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 36, text: "text-2xl" },
    md: { icon: 44, text: "text-3xl" },
    lg: { icon: 60, text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3 group w-fit cursor-default">
      <div 
        className="relative flex items-center justify-center rounded-full overflow-hidden shadow-lg shadow-teal-900/20 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(13,148,136,0.5)]"
        style={{ width: s.icon, height: s.icon, perspective: "500px" }}
      >
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-teal-400 via-teal-600 to-emerald-500 opacity-90 animate-gradient-rotate group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0.5 rounded-full bg-[#0B1121]" />
        <Image
          src="/Mentora2.svg"
          alt="Mentora Logo"
          width={s.icon * 0.75}
          height={s.icon * 0.75}
          className="object-contain relative z-10 logo-3d-spin"
          priority
        />
      </div>

      <span
        className={`${s.text} font-black tracking-widest bg-linear-to-r from-white via-teal-200 to-teal-400 bg-size-[200%_auto] bg-clip-text text-transparent animate-text-shimmer group-hover:from-teal-300 group-hover:via-teal-100 group-hover:to-emerald-300 transition-all duration-500`}
      >
        MENTORA
      </span>
    </div>
  );
}
