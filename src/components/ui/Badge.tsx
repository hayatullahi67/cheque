import { cn } from "@/lib/helpers";
import { ChequeStatus } from "@/lib/constants";

const STATUS_COLORS_PREMIUM: Record<ChequeStatus, string> = {
    [ChequeStatus.SUBMITTED]: "bg-blue-50 text-blue-700 border-blue-100 shadow-blue-50",
    [ChequeStatus.APPROVED_BY_CUSTOMER_SERVICE]: "bg-cyan-50 text-cyan-700 border-cyan-100 shadow-cyan-50",
    [ChequeStatus.VERIFIED_BY_BRANCH_CONTROLLER]: "bg-purple-50 text-purple-700 border-purple-100 shadow-purple-50",
    [ChequeStatus.AUTHORIZED_BY_TELLER]: "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-50",
    [ChequeStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-50",
    [ChequeStatus.RETURNED_FOR_ADJUSTMENT]: "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-50",
    [ChequeStatus.FORWARDED_TO_TELLER]: "bg-cyan-50 text-cyan-700 border-cyan-100 shadow-cyan-50",
};

export function Badge({ status }: { status: ChequeStatus }) {
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm",
            STATUS_COLORS_PREMIUM[status] || "bg-zinc-100 text-zinc-600 border-zinc-200"
        )}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}
