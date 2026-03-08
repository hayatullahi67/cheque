'use client';

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { ChequeStatus } from "@/lib/constants";
import { motion } from "framer-motion";
import {
    FileSearch, CheckCircle, Clock3, TrendingUp, Inbox,
    ArrowRight, Star, Zap, Filter
} from "lucide-react";

export default function CSDashboard() {
    const router = useRouter();
    const allCheques = mockCheques;
    const pendingCheques = allCheques.filter(c =>
        c.status === ChequeStatus.SUBMITTED ||
        c.status === ChequeStatus.RETURNED_FOR_ADJUSTMENT
    );
    const approvedToday = allCheques.filter(c => c.status === ChequeStatus.APPROVED_BY_CUSTOMER_SERVICE);

    const stats = [
        { label: "Pending Review", value: pendingCheques.length, icon: Inbox, color: "from-violet-500 to-indigo-600", shadow: "shadow-indigo-200" },
        { label: "Approved Today", value: approvedToday.length, icon: CheckCircle, color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200" },
        { label: "Avg. Process Time", value: "4 min", icon: Clock3, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
        { label: "Efficiency Score", value: "98.4%", icon: TrendingUp, color: "from-sky-400 to-blue-600", shadow: "shadow-sky-200" },
    ];

    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] as const } }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* ── Hero Banner ───────────────────────────────── */}
            <motion.div variants={itemVariants}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-10 py-10 shadow-2xl shadow-indigo-300/40">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
                    {/* Floating dots pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                    />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-white/20 mb-5">
                                <Star className="h-3 w-3 fill-white" /> Customer Service  •  Initial Review
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
                                Submission Workspace
                            </h2>
                            <p className="text-indigo-200 text-sm font-medium max-w-lg leading-relaxed">
                                Validate cheque submissions and forward verified files to the Branch Controller for physical inspection.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-5xl font-black text-white leading-none">{pendingCheques.length}</div>
                                <div className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.15em] mt-1">In Queue</div>
                            </div>
                            <div className="h-16 w-px bg-white/20" />
                            <div className="text-center">
                                <div className="text-5xl font-black text-white leading-none">{approvedToday.length}</div>
                                <div className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.15em] mt-1">Cleared</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Stat Cards ───────────────────────────────── */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-premium card-hover border border-zinc-100/60 flex flex-col gap-4">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md ${s.shadow}`}>
                            <s.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900 tracking-tight leading-none">{s.value}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* ── Cheque Queue Table ───────────────────────── */}
            <motion.div variants={itemVariants}>
                <div className="bg-white rounded-3xl shadow-premium border border-zinc-100/60 overflow-hidden">
                    {/* Table header */}
                    <div className="px-8 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Submission Queue</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5">
                                {pendingCheques.length} entries awaiting initial validation
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-lg transition-all">
                                <Filter className="h-3.5 w-3.5" /> Filter
                            </button>
                            <button className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-2 rounded-lg transition-all">
                                <Zap className="h-3.5 w-3.5" /> Bulk Action
                            </button>
                        </div>
                    </div>

                    {pendingCheques.length > 0 ? (
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Cheque Ref</TH>
                                    <TH>Account Holder</TH>
                                    <TH>Amount</TH>
                                    <TH>Submitted</TH>
                                    <TH>Status</TH>
                                    <TH className="text-right">Action</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {pendingCheques.map((cheque, i) => (
                                    <motion.tr
                                        key={cheque.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <TD>
                                            <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{cheque.chequeNumber}</span>
                                        </TD>
                                        <TD>
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-600 font-black text-sm shadow-inner shrink-0">
                                                    {cheque.accountName.charAt(0)}
                                                </div>
                                                <span className="font-bold text-zinc-900 text-sm">{cheque.accountName}</span>
                                            </div>
                                        </TD>
                                        <TD><span className="font-black text-zinc-900 text-base">{formatCurrency(cheque.amount)}</span></TD>
                                        <TD><span className="text-zinc-500 text-xs font-medium">{formatDate(cheque.submittedAt)}</span></TD>
                                        <TD><Badge status={cheque.status} /></TD>
                                        <TD className="text-right">
                                            <button
                                                onClick={() => router.push(`/customer-service/review/${cheque.id}`)}
                                                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-200 group-hover:shadow-lg group-hover:shadow-indigo-900/20"
                                            >
                                                <FileSearch className="h-3.5 w-3.5" /> Review
                                                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        </TD>
                                    </motion.tr>
                                ))}
                            </TBody>
                        </Table>
                    ) : (
                        <div className="py-28 flex flex-col items-center justify-center gap-4">
                            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-inner">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-black text-zinc-900 text-lg tracking-tight">All Clear!</p>
                                <p className="text-zinc-400 text-sm font-medium mt-1">No submissions pending review at this time.</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
