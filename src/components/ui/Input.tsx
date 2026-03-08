import { cn } from "@/lib/helpers";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] ml-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm transition-all duration-200 outline-none",
                    "placeholder:text-zinc-300 placeholder:font-medium",
                    "focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 focus:shadow-sm",
                    error ? "border-red-500 focus:ring-red-500/10" : "",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs font-bold text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}
