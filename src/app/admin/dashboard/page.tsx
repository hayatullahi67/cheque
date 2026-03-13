'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
    Users, FileText, UserCheck, TrendingUp,
    ChevronUp, ArrowRight, Activity, CheckCircle2,
    SendHorizonal, LogIn, Stamp, Eye, RefreshCcw,
    ArrowRightCircle, History, Clock, UserCog, Zap
} from "lucide-react";
import { mockCheques, mockUsers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { UserRole, ChequeStatus } from "@/lib/constants";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Build a flat activity log from all cheque logs ──────────────
interface ActivityEntry {
    id: string;
    chequeId: string;
    chequeNumber: string;
    action: string;
    sentBy: string;
    sentByRole: string;
    officeSentTo: string;
    takenBy: string;
    status: 'Pending' | 'Verified' | 'Completed' | 'Returned';
    timestamp: string;
}

function getNextOffice(action: string): string {
    switch (action) {
        case 'SUBMITTED': return 'Customer Service';
        case 'APPROVED_BY_CUSTOMER_SERVICE': return 'Branch Controller';
        case 'VERIFIED_BY_BRANCH_CONTROLLER': return 'Teller / Treasury';
        case 'FORWARDED_TO_TELLER': return 'Teller';
        case 'AUTHORIZED_BY_TELLER': return 'Treasury';
        case 'PAID': return 'DONE';
        case 'RETURNED_FOR_ADJUSTMENT': return 'User';
        default: return 'Next Phase';
    }
}

function getPrevOffice(action: string): string {
    switch (action) {
        case 'SUBMITTED': return 'User Home';
        case 'APPROVED_BY_CUSTOMER_SERVICE': return 'Customer Service';
        case 'VERIFIED_BY_BRANCH_CONTROLLER': return 'Branch Controller';
        case 'FORWARDED_TO_TELLER': return 'Branch Controller';
        case 'AUTHORIZED_BY_TELLER': return 'Teller';
        case 'PAID': return 'Treasury';
        case 'RETURNED_FOR_ADJUSTMENT': return 'Bank Office';
        default: return 'Previous Phase';
    }
}

function buildActivityLog(): ActivityEntry[] {
    const entries: ActivityEntry[] = [];
    mockCheques.forEach(cheque => {
        const sortedLogs = [...(cheque.logs ?? [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // 1. Add historical logs (Verified actions)
        sortedLogs.forEach((log, index) => {
            const prevLog = index > 0 ? sortedLogs[index - 1] : null;
            let sentBy = cheque.accountName;
            let sentByRole = 'Customer';
            
            if (prevLog) {
                sentBy = prevLog.performedBy;
                sentByRole = prevLog.performedByRole.replace(/_/g, ' ');
            }

            entries.push({
                id: log.id,
                chequeId: cheque.id,
                chequeNumber: cheque.chequeNumber,
                action: log.action,
                sentBy: sentBy,
                sentByRole: sentByRole,
                officeSentTo: getNextOffice(log.action),
                takenBy: log.performedBy,
                status: log.action === 'PAID' ? 'Completed' : (log.action.includes('RETURNED') ? 'Returned' : 'Verified'),
                timestamp: log.timestamp,
            });
        });

        // 2. Add "In-Flight" pending state if not finished
        const isFinished = cheque.status === 'PAID' || cheque.status.includes('RETURNED');
        if (!isFinished) {
            const lastLog = sortedLogs[sortedLogs.length - 1];
            entries.push({
                id: `pending-${cheque.id}`,
                chequeId: cheque.id,
                chequeNumber: cheque.chequeNumber,
                action: 'AWAITING_ACTION',
                sentBy: lastLog ? lastLog.performedBy : cheque.accountName,
                sentByRole: lastLog ? lastLog.performedByRole.replace(/_/g, ' ') : 'Customer',
                officeSentTo: cheque.currentOffice,
                takenBy: 'Not Taken',
                status: 'Pending',
                timestamp: new Date().toISOString(), // Current state
            });
        }
    });

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
    SUBMISSION_PENDING: { label: "Entry Initiated", color: "text-amber-600", bg: "bg-amber-50", Icon: History },
    VERIFIED_BY_BRANCH_CONTROLLER: { label: "BC Verified", color: "text-violet-600", bg: "bg-violet-50", Icon: Stamp },
    FORWARDED_TO_TELLER: { label: "Sent to Teller", color: "text-cyan-600", bg: "bg-cyan-50", Icon: SendHorizonal },
    AWAITING_ACTION: { label: "Awaiting Action", color: "text-amber-600", bg: "bg-amber-100/50", Icon: Clock },
};

function getActionMeta(action: string) {
    return ACTION_META[action] ?? { label: action.replace(/_/g, ' '), color: "text-zinc-500", bg: "bg-zinc-50", Icon: Activity };
}

export default function AdminDashboard() {
    const totalCheques = mockCheques.length;
    const totalEmployees = mockUsers.filter(u => u.employeeId).length;
    const settledValue = formatCurrency(mockCheques.filter(c => c.status === 'PAID').reduce((t, c) => t + c.amount, 0));
    const totalUsers = mockUsers.filter(u => u.role === UserRole.USER).length;

    const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

    useEffect(() => {
        setActivityLog(buildActivityLog());
    }, []);

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
                    <Table className="border-separate border-spacing-y-2 px-4 pb-4">
                        <THead className="bg-zinc-50/50">
                        
                            <TR className="hover:bg-transparent border-none">
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Cheque Ref</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Sent By</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Office Sent To</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Taken By</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Status</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4">Created At</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 py-4 text-right">Details</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {activityLog.length === 0 ? (
                                <TR>
                                    <TD colSpan={7} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center">
                                                <History className="h-6 w-6 text-zinc-300" />
                                            </div>
                                            <p className="text-zinc-400 text-sm font-black uppercase tracking-widest">No activity recorded yet</p>
                                        </div>
                                    </TD>
                                </TR>
                            ) : activityLog.map((entry, i) => {
                                const meta = getActionMeta(entry.action);
                                const Icon = meta.Icon;
                                const detailPath = `/admin/cheques/${entry.chequeId}`;

                                return (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-zinc-50/50 transition-all group cursor-default"
                                    >
                                        <TD>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50 w-fit">
                                                    {entry.chequeNumber}
                                                </span>
                                            </div>
                                        </TD>
                                        <TD>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-zinc-900 leading-none">{entry.sentBy}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{entry.sentByRole}</span>
                                            </div>
                                        </TD>
                                        <TD>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/30">
                                                {entry.officeSentTo}
                                            </span>
                                        </TD>
                                        <TD>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-md bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-200">
                                                    {entry.takenBy.charAt(0)}
                                                </div>
                                                <span className="text-xs font-black text-zinc-700">{entry.takenBy}</span>
                                            </div>
                                        </TD>
                                        <TD>
                                            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter
                                                ${entry.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                                                  entry.status === 'Verified' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                                  entry.status === 'Returned' ? 'text-rose-600 bg-rose-50 border-rose-100' : 
                                                  'text-amber-600 bg-amber-50 border-amber-100'}`}>
                                                {entry.status === 'Verified' ? <CheckCircle2 className="h-2.5 w-2.5" /> : 
                                                 entry.status === 'Pending' ? <Clock className="h-2.5 w-2.5" /> : null}
                                                {entry.status}
                                            </span>
                                        </TD>
                                        <TD>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-zinc-900 font-bold whitespace-nowrap">
                                                    {formatDate(entry.timestamp).split(', ')[0]}
                                                </span>
                                                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">
                                                    {formatDate(entry.timestamp).split(', ')[1]}
                                                </span>
                                            </div>
                                        </TD>
                                        <TD className="text-right">
                                            <Link href={detailPath}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                    <ArrowRightCircle className="h-4 w-4" />
                                                </Button>
                                            </Link>
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
