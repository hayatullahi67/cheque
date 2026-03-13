import { cn } from "@/lib/helpers"

export function Table({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn("w-full min-w-max text-left text-sm", className)}>
                {children}
            </table>
        </div>
    )
}

export function THead({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <thead className={cn("border-b border-zinc-200 bg-zinc-50/50", className)}>
            {children}
        </thead>
    )
}

export function TBody({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <tbody className={cn("divide-y divide-zinc-200", className)}>
            {children}
        </tbody>
    )
}

export function TH({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <th className={cn("px-4 py-3 font-medium text-zinc-500", className)}>
            {children}
        </th>
    )
}

export function TR({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    return (
        <tr
            className={cn("transition-colors hover:bg-zinc-50/50", onClick && "cursor-pointer", className)}
            onClick={onClick}
        >
            {children}
        </tr>
    )
}

export function TD({ children, className, colSpan }: { children: React.ReactNode, className?: string, colSpan?: number }) {
    return (
        <td colSpan={colSpan} className={cn("px-4 py-4 text-zinc-700", className)}>
            {children}
        </td>
    )
}
