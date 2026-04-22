import { Separator } from "@/components/ui/separator";

interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-2">
      <Separator className="flex-1 bg-white/10" />
      <span className="text-xs text-white/30 font-medium uppercase tracking-widest shrink-0">
        {label}
      </span>
      <Separator className="flex-1 bg-white/10" />
    </div>
  );
}
