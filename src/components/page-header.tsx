import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground shadow-elegant">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
