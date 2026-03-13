'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ShieldCheck, ArrowLeft, Stamp, CheckCircle2,
    User, Calendar, Building2, Activity,
    ExternalLink, Zap, Loader2, Cpu, Sparkles, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion } from "framer-motion";
import Link from 'next/link';

// ─── Info Card ────────────────────────────────────────────────────────────────
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/helpers";

// ─── Streamlined Info Card ───────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, sub, accent = false }: {
    icon: any; label: string; value: string; sub?: string; accent?: boolean;
}) {
    return (
        <div className={cn(
            "rounded-3xl p-6 border flex gap-4 items-start transition-all duration-300",
            accent 
                ? "bg-indigo-50/50 border-indigo-100/50 shadow-sm" 
                : "bg-white border-zinc-100 hover:border-indigo-100 hover:shadow-md"
        )}>
            <div className={cn(
                "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center transition-colors",
                accent ? "bg-indigo-600 text-white" : "bg-zinc-50 text-zinc-400 group-hover:text-indigo-600"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1.5">{label}</p>
                <p className="text-sm font-black text-zinc-900 truncate tracking-tight">{value}</p>
                {sub && <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wide opacity-70">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserChequeDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = useMemo(() => mockCheques.find(c => c.id === id), [id]);

    if (!cheque) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 gap-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Querying Node...</p>
        </div>
    );

    const isDone = cheque.status === 'PAID';

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-24">
            {/* Minimal Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100/80 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 hover:text-zinc-900 transition-all p-0"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Tracking Record</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-200" />
                            <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{cheque.chequeNumber}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50">
                        <Activity className="h-3 w-3 text-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Audit Stream Active</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
                {/* Master Record Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-10 border-none ring-1 ring-zinc-100 relative overflow-hidden group shadow-xl shadow-zinc-200/50">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <Cpu className="h-64 w-64" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Badge status={cheque.status as any} />
                                    <div className="h-1 w-1 rounded-full bg-zinc-200" />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID: {cheque.id}</span>
                                </div>
                                <h1 className="text-6xl font-black text-zinc-900 tracking-tighter leading-none">
                                    {formatCurrency(cheque.amount)}
                                </h1>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Asset Reference</p>
                                        <p className="text-sm font-black text-indigo-600 tracking-tight font-mono">{cheque.chequeNumber}</p>
                                    </div>
                                    <div className="w-px h-10 bg-zinc-100" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Designated Holder</p>
                                        <p className="text-sm font-black text-zinc-900 tracking-tight">{cheque.accountName}</p>
                                    </div>
                                </div>
                            </div>

                            <Card className="bg-zinc-900 p-8 w-full md:w-72 border-none shadow-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verification stage</p>
                                    <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-black text-white">{isDone ? 'Asset Cleared' : 'In Review'}</h3>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: isDone ? '100%' : '65%' }}
                                        transition={{ duration: 1.5, ease: 'circOut' }}
                                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Node: {cheque.currentOffice}</p>
                            </Card>
                        </div>
                    </Card>
                </motion.div>

                {/* Secondary Intel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard icon={User} label="Payer Identity" value={cheque.accountName} sub={`Record: ${cheque.accountNumber}`} />
                            <InfoCard icon={Building2} label="Processing Branch" value={cheque.bankBranch} sub="Verified Node" accent />
                            <InfoCard icon={Calendar} label="Timestamp" value={formatDate(cheque.submittedAt)} sub="Clock Synced" />
                            <InfoCard icon={ShieldCheck} label="Encryption" value="AES-256 Active" sub="Tier-1 Security" accent />
                        </div>

                        {/* Audit Pulse Timeline */}
                        <Card className="p-10 border-none ring-1 ring-zinc-100 shadow-sm relative overflow-hidden bg-white rounded-[2.5rem]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-10 w-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                                    <Stamp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Audit Trail</h3>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Real-time status replication</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                <div className="absolute left-7 top-0 bottom-0 w-px bg-zinc-100" />
                                {(['Customer', 'Customer Service', 'Branch Controller', 'Teller', 'DONE'] as const).map((office, idx) => {
                                    const isCurrent = cheque.currentOffice === office;
                                    const hasPassed = idx < (['Customer', 'Customer Service', 'Branch Controller', 'Teller', 'DONE'] as const).indexOf(cheque.currentOffice as any) || cheque.status === 'PAID';
                                    const officeLabel = office === 'DONE' ? 'Payment released' : office;

                                    return (
                                        <div key={office} className={cn(
                                            "relative flex items-center justify-between p-5 rounded-2xl transition-all duration-500",
                                            isCurrent ? "bg-indigo-50/30 border border-indigo-100 shadow-sm translate-x-1" : "bg-transparent border border-transparent opacity-60"
                                        )}>
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 transition-colors duration-500",
                                                    hasPassed ? "bg-emerald-500 text-white" : isCurrent ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-300"
                                                )}>
                                                    <CheckCircle2 className={cn("h-4 w-4", !hasPassed && "opacity-0")} />
                                                    {!hasPassed && <span className="text-[10px] font-black">{idx + 1}</span>}
                                                </div>
                                                <div>
                                                    <p className={cn("text-xs font-black uppercase tracking-tight", isCurrent ? "text-zinc-900" : "text-zinc-400")}>{officeLabel}</p>
                                                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Node Authorization</p>
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <div className="flex items-center gap-2 text-indigo-600">
                                                    <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Processing</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-8 border-none ring-1 ring-zinc-100 shadow-sm bg-zinc-900 text-white relative overflow-hidden group rounded-[2.5rem]">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                <Fingerprint className="h-32 w-32" />
                            </div>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 font-mono">Support Core</h4>
                            <h3 className="text-xl font-black mb-2 tracking-tight">Need Intel?</h3>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-8"> Our automated support node is available 24/7 if you notice any discrepancies in the audit trail.</p>
                            <Button className="w-full h-14 bg-white text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 shadow-xl">
                                Request Assistance
                            </Button>
                        </Card>

                        <div className="flex gap-4">
                            <Card className="flex-1 p-6 border-none ring-1 ring-zinc-100 shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:ring-indigo-100 transition-all">
                                <ExternalLink className="h-6 w-6 text-zinc-300 group-hover:text-indigo-600 transition-colors mb-3" />
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Export Path</span>
                            </Card>
                            <Card className="flex-1 p-6 border-none ring-1 ring-zinc-100 shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:ring-emerald-100 transition-all">
                                <CheckCircle2 className="h-6 w-6 text-zinc-300 group-hover:text-emerald-600 transition-colors mb-3" />
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Verify Seal</span>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
