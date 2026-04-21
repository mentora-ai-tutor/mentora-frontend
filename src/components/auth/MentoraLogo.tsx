import Link from "next/link";
import Image from "next/image";

export default function MentoraLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 36, text: "text-2xl" },
    md: { icon: 44, text: "text-3xl" },
    lg: { icon: 60, text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-3 group w-fit">
      {/* Real Logo Image */}
      <div 
        className="relative flex items-center justify-center bg-white rounded-full shadow-lg shadow-teal-900/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(13,148,136,0.4)] transition-all duration-300"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/Mentora.png"
          alt="Mentora Logo"
          width={s.icon * 0.65}
          height={s.icon * 0.65}
          className="object-contain"
          priority
        />
      </div>

      {/* Wordmark */}
      <span
        className={`${s.text} font-black tracking-widest text-white`}
      >
        MENTORA
      </span>
    </Link>
  );
}
