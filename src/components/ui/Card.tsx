import { cn } from "@/lib/helpers";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={cn(
            "bg-white rounded-2xl border border-zinc-100/60 shadow-premium overflow-hidden transition-all duration-300",
            className
        )}>
            {children}
        </div>
    );
}

export function CardHeader({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between gap-4 bg-gradient-to-r from-white to-zinc-50/30">
            <div>
                <h3 className="text-base font-black text-zinc-900 tracking-tight leading-none">{title}</h3>
                {subtitle && <p className="text-xs text-zinc-400 font-medium mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
