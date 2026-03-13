'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Activity, CheckCircle2, Stamp, Eye, RefreshCcw,
    TrendingUp, Search, Filter, Download, ArrowRightCircle,
    History, Clock, Zap, ArrowRight, LayoutDashboard
} from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion } from "framer-motion";
import Link from "next/link";

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
    amount: number;
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
                amount: cheque.amount
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
                timestamp: new Date().toISOString(),
                amount: cheque.amount
            });
        }
    });

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const ACTION_META: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
    AWAITING_ACTION: { label: "Awaiting Action", color: "text-amber-600", bg: "bg-amber-100/50", Icon: Clock },
};

function getActionMeta(action: string) {
    return ACTION_META[action] ?? { label: action.replace(/_/g, ' '), color: "text-zinc-500", bg: "bg-zinc-50", Icon: Activity };
}

export default function LiveMonitorPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setActivityLog(buildActivityLog());
        setMounted(true);
    }, []);

    const filteredLogs = useMemo(() => {
        return activityLog.filter(log => {
            const matchesSearch =
                log.chequeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.sentBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.officeSentTo.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === "ALL" || log.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [activityLog, searchTerm, filterStatus]);

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
    };
    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
    };
    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Warming Engine...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* ── Premium Header ────────────────────────────────────────── */}
            {/* <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-10 sm:p-12 shadow-2xl border border-zinc-800">
                <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none rotate-12">
                    <History className="w-80 h-80 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Live Audit Engine</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                            Global Activity History
                        </h1>
                        <p className="text-zinc-400 font-medium max-w-2xl text-base leading-relaxed">
                            A comprehensive, immutable ledger of all system interactions. Track every cheque submission, verification, and payout across all branches in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 min-w-[140px] shadow-2xl">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 leading-none">Total Events</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-white">{activityLog.length}</p>
                                <span className="text-[10px] font-bold text-emerald-400">Records</span>
                            </div>
                        </div>
                        <Button className="h-14 px-8 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>
            </div> */}

            {/* ── Filters & Table ────────────────────────────────────────── */}
            <motion.div variants={container} initial="hidden" animate="show">
                <Card className="border-transparent shadow-premium overflow-visible p-0 bg-white/50 backdrop-blur-sm">
                    {/* Filter Bar */}
                    <div className="p-6 border-b border-zinc-100 flex flex-col lg:flex-row gap-4 items-center justify-between bg-zinc-50/50 rounded-t-[2.5rem]">
                        <div className="relative w-full lg:max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by Cheque Ref, Staff Name, or Action..."
                                className="h-12 pl-11 bg-white border-zinc-200 focus-visible:ring-indigo-500 font-bold text-sm placeholder:text-zinc-400 w-full rounded-xl shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:flex-none">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <select
                                    className="w-full lg:w-[220px] h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white text-xs font-black uppercase tracking-widest text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none cursor-pointer transition-all"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Returned">Returned</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <Table className="border-separate border-spacing-y-2.5 px-6 pb-6">
                        <THead className="bg-transparent">
                            <TR className="hover:bg-transparent border-none">
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Cheque Ref</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Sent By</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Office Sent To</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Taken By</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Status</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6">Created At</TH>
                                <TH className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 py-6 text-right">Details</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {filteredLogs.length === 0 ? (
                                <TR className="bg-transparent">
                                    <TD colSpan={7} className="py-32">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                                                <Activity className="h-8 w-8 text-zinc-200" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-zinc-900 font-black text-lg tracking-tight">No live pulses found</p>
                                                <p className="text-zinc-400 font-medium text-sm">Waiting for incoming system signals...</p>
                                            </div>
                                        </div>
                                    </TD>
                                </TR>
                            ) : (
                                filteredLogs.map((entry, i) => {
                                    const detailPath = `/admin/cheques/${entry.chequeId}`;

                                    return (
                                        <motion.tr
                                            key={entry.id}
                                            variants={item}
                                            className="bg-white hover:bg-indigo-50/30 transition-all group cursor-default shadow-sm border border-zinc-100 rounded-2xl overflow-hidden"
                                        >
                                            <TD className="rounded-l-2xl border-y border-l border-zinc-100/50">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-mono text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 w-fit">
                                                        #{entry.chequeNumber}
                                                    </span>
                                                    <span className="text-[10px] font-black text-zinc-900 ml-1">{formatCurrency(entry.amount)}</span>
                                                </div>
                                            </TD>
                                            <TD className="border-y border-zinc-100/50">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-zinc-900 leading-none">{entry.sentBy}</span>
                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.1em] mt-1.5">{entry.sentByRole}</span>
                                                </div>
                                            </TD>
                                            <TD className="border-y border-zinc-100/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-tighter bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                                        {entry.officeSentTo}
                                                    </span>
                                                </div>
                                            </TD>
                                            <TD className="border-y border-zinc-100/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white">
                                                        {entry.takenBy.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-black text-zinc-800">{entry.takenBy}</span>
                                                </div>
                                            </TD>
                                            <TD className="border-y border-zinc-100/50">
                                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider
                                                    ${entry.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                                                      entry.status === 'Verified' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                                      entry.status === 'Returned' ? 'text-rose-600 bg-rose-50 border-rose-100' : 
                                                      'text-amber-600 bg-amber-50 border-amber-100 shadow-sm shadow-amber-50'}`}>
                                                    {entry.status === 'Verified' ? <CheckCircle2 className="h-3 w-3" /> : 
                                                     entry.status === 'Pending' ? <Clock className="h-3 w-3 animate-spin-slow" /> : null}
                                                    {entry.status}
                                                </span>
                                            </TD>
                                            <TD className="border-y border-zinc-100/50">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] text-zinc-900 font-bold whitespace-nowrap">
                                                        {formatDate(entry.timestamp).split(', ')[0]}
                                                    </span>
                                                    <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                                                        {formatDate(entry.timestamp).split(', ')[1]}
                                                    </span>
                                                </div>
                                            </TD>
                                            <TD className="text-right rounded-r-2xl border-y border-r border-zinc-100/50">
                                                <Link href={detailPath}>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-200">
                                                        <ArrowRightCircle className="h-5 w-5" />
                                                    </Button>
                                                </Link>
                                            </TD>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </TBody>
                    </Table>
                </Card>
            </motion.div>
        </div>
    );
}
