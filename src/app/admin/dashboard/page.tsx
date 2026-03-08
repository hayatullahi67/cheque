'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
    Users, FileText, UserCheck, TrendingUp,
    ChevronUp, ArrowRight, Activity, CheckCircle2,
    SendHorizonal, LogIn, Stamp, Eye, RefreshCcw
} from "lucide-react";
import { mockCheques, mockUsers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { UserRole } from "@/lib/constants";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Build a flat activity log from all cheque logs ──────────────
interface ActivityEntry {
    id: string;
    chequeNumber: string;
    action: string;
    performedBy: string;
    performedByRole: string;
    office?: string;
    timestamp: string;
}

function buildActivityLog(): ActivityEntry[] {
    const entries: ActivityEntry[] = [];
    mockCheques.forEach(cheque => {
        (cheque.logs ?? []).forEach(log => {
            entries.push({
                id: log.id,
                chequeNumber: cheque.chequeNumber,
                action: log.action,
                performedBy: log.performedBy,
                performedByRole: log.performedByRole,
                office: cheque.currentOffice,
                timestamp: log.timestamp,
            });
        });
        // also show the cheque itself as a submission event if no log covers it
        if (!cheque.logs || cheque.logs.length === 0) {
            entries.push({
                id: `auto-${cheque.id}`,
                chequeNumber: cheque.chequeNumber,
                action: cheque.status,
                performedBy: cheque.accountName,
                performedByRole: UserRole.USER,
                office: cheque.currentOffice,
                timestamp: cheque.submittedAt,
            });
        }
    });
    // sort newest first
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const ACTION_META: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
    SUBMITTED: { label: "Submitted", color: "text-indigo-600", bg: "bg-indigo-50", Icon: LogIn },
    APPROVED_BY_CUSTOMER_SERVICE: { label: "CS Approved", color: "text-sky-600", bg: "bg-sky-50", Icon: CheckCircle2 },
    APPROVED_BY_BRANCH_CONTROLLER: { label: "BC Verified", color: "text-violet-600", bg: "bg-violet-50", Icon: Stamp },
    AUTHORIZED_BY_TELLER: { label: "Teller Authorized", color: "text-amber-600", bg: "bg-amber-50", Icon: Eye },
    PAID: { label: "Payment Released", color: "text-emerald-600", bg: "bg-emerald-50", Icon: TrendingUp },
    RETURNED_FOR_ADJUSTMENT: { label: "Returned for Fix", color: "text-red-500", bg: "bg-red-50", Icon: RefreshCcw },
    FORWARDED: { label: "Forwarded", color: "text-blue-600", bg: "bg-blue-50", Icon: SendHorizonal },
};

function getActionMeta(action: string) {
    return ACTION_META[action] ?? { label: action.replace(/_/g, ' '), color: "text-zinc-500", bg: "bg-zinc-50", Icon: Activity };
}

export default function AdminDashboard() {
    const totalCheques = mockCheques.length;
    const totalEmployees = mockUsers.filter(u => u.employeeId).length;
    const settledValue = formatCurrency(mockCheques.filter(c => c.status === 'PAID').reduce((t, c) => t + c.amount, 0));
    const totalUsers = mockUsers.filter(u => u.role === UserRole.USER).length;

    const activityLog = buildActivityLog();

    const stats = [
        {
            title: "Total Cheques",
            value: totalCheques,
            icon: FileText,
            gradient: "from-indigo-500 to-violet-600",
            shadow: "shadow-indigo-200",
            bg: "bg-indigo-50",
            text: "text-indigo-700",
            change: "+12%",
            sub: "All submitted cheques",
        },
        {
            title: "Total Employees",
            value: totalEmployees,
            icon: UserCheck,
            gradient: "from-sky-500 to-blue-600",
            shadow: "shadow-sky-200",
            bg: "bg-sky-50",
            text: "text-sky-700",
            change: "+2",
            sub: "Active bank staff",
        },
        {
            title: "Settled Value",
            value: settledValue,
            icon: TrendingUp,
            gradient: "from-amber-400 to-orange-500",
            shadow: "shadow-amber-200",
            bg: "bg-amber-50",
            text: "text-amber-700",
            change: "+8%",
            sub: "Total amount paid out",
        },
        {
            title: "Total Users",
            value: totalUsers,
            icon: Users,
            gradient: "from-emerald-400 to-teal-500",
            shadow: "shadow-emerald-200",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            change: "+5%",
            sub: "Registered customers",
        },
    ];

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.09 } },
    };
    const item = {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.8, 0.25, 1] as const } },
    };

    return (
        <motion.div className="space-y-10" variants={container} initial="hidden" animate="show">

            {/* ── Stat Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <motion.div key={s.title} variants={item}>
                        <div className={`relative overflow-hidden rounded-2xl bg-white border border-zinc-100/80 shadow-md ${s.shadow}/30 p-6 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient} rounded-t-2xl`} />
                            <div className={`absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-br ${s.gradient} opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-300`} />
                            <div className="flex items-start justify-between mb-5">
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg ${s.shadow}`}>
                                    <s.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${s.text} ${s.bg} px-2.5 py-1 rounded-full`}>
                                    <ChevronUp className="h-3 w-3" />{s.change}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.16em] mb-1">{s.title}</p>
                            <p className="text-3xl font-black text-zinc-900 tracking-tighter leading-none">{s.value}</p>
                            <p className="text-[11px] text-zinc-400 font-medium mt-2">{s.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Activity History ─────────────────────────────── */}
            <motion.div variants={item}>
                <Card className="border-transparent shadow-premium">
                    <CardHeader
                        title="Activity History"
                        subtitle="Live log of every action across all offices and staff"
                        action={
                            <Link href="/admin/cheques">
                                <Button variant="secondary" size="sm" className="font-black text-[10px]">
                                    Full Audit Log <ArrowRight className="ml-1 h-3 w-3 inline" />
                                </Button>
                            </Link>
                        }
                    />
                    <Table>
                        <THead>
                            <TR>
                                <TH>Cheque Ref</TH>
                                <TH>Action</TH>
                                <TH>Performed By</TH>
                                <TH>Role / Office</TH>
                                <TH>Timestamp</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {activityLog.length === 0 ? (
                                <TR>
                                    <TD colSpan={5} className="text-center py-10 text-zinc-400 text-sm font-medium">
                                        No activity recorded yet.
                                    </TD>
                                </TR>
                            ) : activityLog.map((entry, i) => {
                                const meta = getActionMeta(entry.action);
                                const Icon = meta.Icon;
                                return (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-indigo-50/20 transition-colors group"
                                    >
                                        <TD>
                                            <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                                {entry.chequeNumber}
                                            </span>
                                        </TD>
                                        <TD>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${meta.bg} ${meta.color}`}>
                                                <Icon className="h-3 w-3" />
                                                {meta.label}
                                            </span>
                                        </TD>
                                        <TD>
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-600 font-black text-xs shrink-0">
                                                    {entry.performedBy.charAt(0)}
                                                </div>
                                                <span className="font-bold text-zinc-900 text-sm">{entry.performedBy}</span>
                                            </div>
                                        </TD>
                                        <TD>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                    {entry.performedByRole.replace(/_/g, ' ')}
                                                </span>
                                                {entry.office && entry.office !== 'DONE' && (
                                                    <span className="text-[9px] font-bold text-indigo-400">{entry.office}</span>
                                                )}
                                            </div>
                                        </TD>
                                        <TD>
                                            <span className="text-xs text-zinc-400 font-medium">{formatDate(entry.timestamp)}</span>
                                        </TD>
                                    </motion.tr>
                                );
                            })}
                        </TBody>
                    </Table>
                </Card>
            </motion.div>
        </motion.div>
    );
}
