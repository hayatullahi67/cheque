'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Activity, CheckCircle2, SendHorizonal, LogIn, Stamp, Eye, RefreshCcw,
    TrendingUp, Search, Filter, Download, ArrowUpDown, History
} from "lucide-react";
import { mockCheques, mockUsers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { UserRole } from "@/lib/constants";
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
    amount: number;
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
                amount: cheque.amount,
            });
        });

        // Include initial submission if it lacks a log
        if (!cheque.logs || cheque.logs.length === 0) {
            entries.push({
                id: `auto-${cheque.id}`,
                chequeNumber: cheque.chequeNumber,
                action: cheque.status,
                performedBy: cheque.accountName,
                performedByRole: UserRole.USER,
                office: cheque.currentOffice,
                timestamp: cheque.submittedAt,
                amount: cheque.amount,
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
};

function getActionMeta(action: string) {
    return ACTION_META[action] ?? { label: action.replace(/_/g, ' '), color: "text-zinc-500", bg: "bg-zinc-50", Icon: Activity };
}

export default function ChequesAuditLog() {
    const [initialLogs, setInitialLogs] = useState<ActivityEntry[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOffice, setFilterOffice] = useState("ALL");

    useEffect(() => {
        setInitialLogs(buildActivityLog());
    }, []);


    // Derived state for filtering
    const filteredLogs = useMemo(() => {
        return initialLogs.filter(log => {
            const matchesSearch =
                log.chequeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesOffice = filterOffice === "ALL" || log.office === filterOffice;

            return matchesSearch && matchesOffice;
        });
    }, [initialLogs, searchTerm, filterOffice]);

    const uniqueOffices = useMemo(() => {
        const offices = new Set(initialLogs.map(l => l.office).filter(Boolean));
        return ["ALL", ...Array.from(offices)];
    }, [initialLogs]);

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
    };
    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="space-y-6">
            {/* Header section with stats/title in a dark theme to match other pages
            <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-8 sm:p-10 shadow-2xl border border-zinc-800">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <History className="w-64 h-64 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Live Audit Engine</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                            Global Activity History
                        </h1>
                        <p className="text-zinc-400 font-medium max-w-xl text-sm sm:text-base leading-relaxed">
                            A comprehensive, immutable ledger of all system interactions. Track every cheque submission, verification, and payout across all branches in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 min-w-[120px]">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Events</p>
                            <p className="text-3xl font-black text-white">{initialLogs.length}</p>
                        </div>
                        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-xl shadow-white/10">
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>
            </div> */}

            {/* Filters & Search */}
            <Card className="border-transparent shadow-premium overflow-visible">
                <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50/50 rounded-t-2xl">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search by Cheque Ref, Staff Name, or Action..."
                            className="pl-9 bg-white border-zinc-200 focus-visible:ring-indigo-500 font-medium placeholder:text-zinc-400 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <select
                                className="w-full sm:w-[180px] h-10 pl-9 pr-4 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer appearance-none transition-shadow"
                                value={filterOffice}
                                onChange={(e) => setFilterOffice(e.target.value)}
                            >
                                {uniqueOffices.map(office => (
                                    <option key={office} value={office}>{office === "ALL" ? "All Locations" : office}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <THead>
                        <TR className="bg-zinc-50/80">
                            <TH className="py-4">Cheque Ref</TH>
                            <TH className="py-4">Amount</TH>
                            <TH className="py-4">Action</TH>
                            <TH className="py-4">Performed By</TH>
                            <TH className="py-4">Role & Location</TH>
                            <TH className="py-4">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
                                    Timestamp <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TH>
                        </TR>
                    </THead>
                    <TBody>
                        {filteredLogs.length === 0 ? (
                            <TR>
                                <TD colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                            <Search className="h-6 w-6 text-zinc-400" />
                                        </div>
                                        <p className="text-zinc-900 font-bold text-lg">No records found</p>
                                        <p className="text-zinc-500 font-medium mt-1">Try adjusting your search filters.</p>
                                    </div>
                                </TD>
                            </TR>
                        ) : (
                            filteredLogs.map((entry, i) => {
                                const meta = getActionMeta(entry.action);
                                const Icon = meta.Icon;
                                return (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(i * 0.05, 0.5) }} // Cap the delay to make it snappier
                                        className="hover:bg-indigo-50/20 transition-colors group cursor-default"
                                    >
                                        <TD>
                                            <span className="font-mono text-[12px] font-black text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1.5 rounded-md shadow-sm">
                                                {entry.chequeNumber}
                                            </span>
                                        </TD>
                                        <TD>
                                            <span className="font-bold text-zinc-900">{formatCurrency(entry.amount)}</span>
                                        </TD>
                                        <TD>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${meta.bg} ${meta.color} border border-${meta.color.split('-')[1]}-100`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {meta.label}
                                            </span>
                                        </TD>
                                        <TD>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                                                    {entry.performedBy.charAt(0)}
                                                </div>
                                                <span className="font-bold text-zinc-900 text-sm">{entry.performedBy}</span>
                                            </div>
                                        </TD>
                                        <TD>
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="text-[10px] font-black text-zinc-icon bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-widest text-zinc-600">
                                                    {entry.performedByRole.replace(/_/g, ' ')}
                                                </span>
                                                {entry.office && entry.office !== 'DONE' && (
                                                    <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                        {entry.office}
                                                    </span>
                                                )}
                                            </div>
                                        </TD>
                                        <TD>
                                            <span className="text-xs text-zinc-500 font-semibold">{formatDate(entry.timestamp)}</span>
                                        </TD>
                                    </motion.tr>
                                );
                            })
                        )}
                    </TBody>
                </Table>
            </Card>
        </div>
    );
}
