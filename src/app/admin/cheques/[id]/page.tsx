'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ShieldCheck, ArrowLeft, Stamp, CheckCircle2,
    User, Calendar, Hash, Phone, ChevronRight,
    Clock, Building2, Activity, UserCog,
    ExternalLink, Timer, RefreshCcw, LayoutDashboard, Zap
} from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion } from "framer-motion";
import Link from 'next/link';

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, sub, accent = false }: {
    icon: any; label: string; value: string; sub?: string; accent?: boolean;
}) {
    return (
        <div className={`rounded-2xl p-4 border flex gap-3 items-start transition-all
            ${accent
                ? 'bg-indigo-50 border-indigo-100'
                : 'bg-white border-zinc-100 shadow-sm hover:border-indigo-100'}`}>
            <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-xl flex items-center justify-center
                ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-zinc-50 text-zinc-400'}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-sm font-bold truncate ${accent ? 'text-indigo-900' : 'text-zinc-800'}`}>{value}</p>
                {sub && <p className="text-[10px] text-zinc-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
        APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        RETURNED: 'bg-red-50 text-red-600 border-red-200',
        PAID: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    };
    const key = Object.keys(map).find(k => status.includes(k)) ?? '';
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[key] ?? 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}

// ─── Log Icon ─────────────────────────────────────────────────────────────────
function LogIcon({ action }: { action: string }) {
    if (action.includes('APPROVED')) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (action.includes('RETURNED')) return <RefreshCcw className="h-4 w-4 text-red-400" />;
    if (action.includes('PAID')) return <LayoutDashboard className="h-4 w-4 text-indigo-500" />;
    return <Stamp className="h-4 w-4 text-zinc-400" />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminChequeDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = useMemo(() => mockCheques.find(c => c.id === id), [id]);

    // Calculate durations for each office (Hardcoded for demonstration)
    const officeStats = useMemo(() => {
        if (!cheque) return [];
        return [
            { office: 'Customer Service', duration: '12m' },
            { office: 'Branch Controller', duration: '45m' },
            { office: 'Teller', duration: '8m' },
            { office: 'Treasury', duration: '5m' }
        ];
    }, [cheque]);

    if (!cheque) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 gap-3">
            <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Loading...</p>
        </div>
    );

    const submissionTime = new Date(cheque.submittedAt).getTime();
    const elapsed = Date.now() - submissionTime;
    const hrs = Math.floor(elapsed / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    const isDone = cheque.currentOffice === 'DONE';

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* ── Top Nav ── */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => router.back()}
                        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1.5 min-w-0 text-xs font-semibold">
                        <Link href="/admin/dashboard" className="text-zinc-400 hover:text-indigo-600 transition-colors hidden sm:block shrink-0">
                            Dashboard
                        </Link>
                        <ChevronRight className="h-3 w-3 text-zinc-300 hidden sm:block shrink-0" />
                        <span className="text-zinc-700 truncate">Cheque #{cheque.chequeNumber}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:block">Live</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
                {/* ── Hero Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-white border border-zinc-100 shadow-xl shadow-indigo-50/50 p-6 sm:p-8"
                >
                    {/* bg decoration */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <Zap className="absolute -right-8 -top-8 h-48 w-48 text-indigo-50 rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        {/* Left */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={cheque.status} />
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold text-zinc-500 bg-zinc-50 border border-zinc-200">
                                    Ref: {cheque.id}
                                </span>
                            </div>
                            <p className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tighter leading-none">
                                {formatCurrency(cheque.amount)}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Beneficiary</p>
                                    <p className="font-bold text-zinc-800">{cheque.accountName}</p>
                                </div>
                                <div className="w-px bg-zinc-100 self-stretch hidden sm:block" />
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cheque No.</p>
                                    <p className="font-black text-indigo-600 font-mono">{cheque.chequeNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right – Status box */}
                        <div className="bg-zinc-900 text-white rounded-2xl p-5 w-full sm:w-56 shrink-0 space-y-3">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Current Stage</p>
                            <p className="text-xl font-black">{isDone ? 'Settled ✓' : 'In Progress'}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">At: {cheque.currentOffice}</p>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isDone ? '100%' : '65%' }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-indigo-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Layout: Details + Sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Left: Details + Timeline ── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InfoCard icon={User} label="Account Holder" value={cheque.accountName} sub={`Acc: ${cheque.accountNumber}`} />
                            <InfoCard icon={Hash} label="Account Number" value={cheque.accountNumber} sub="Verified Savings" accent />
                            <InfoCard icon={Building2} label="Branch" value={cheque.bankBranch} sub="Lagos Mainland" />
                            <InfoCard icon={Phone} label="Phone" value={cheque.phoneNumber} sub="Registered Mobile" />
                            <InfoCard icon={Calendar} label="Submitted" value={formatDate(cheque.submittedAt).split(' - ')[0]} sub={formatDate(cheque.submittedAt).split(' - ')[1]} />
                            <InfoCard icon={ShieldCheck} label="Validation" value="Match Confirmed" sub="Digital Signature Passed" accent />
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-3xl border border-zinc-100 shadow-lg p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-black text-zinc-900 text-base">Office Progress Tracker</p>
                                    <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Live location & verification status</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(['Customer', 'Customer Service', 'Branch Controller', 'Teller', 'DONE'] as const).map((office, idx) => {
                                    const isCurrent = cheque.currentOffice === office;
                                    const hasPassed = idx < (['Customer', 'Customer Service', 'Branch Controller', 'Teller', 'DONE'] as const).indexOf(cheque.currentOffice as any) || cheque.status === 'PAID';
                                    const isReturned = cheque.status.includes('RETURNED') && isCurrent;
                                    const isFinal = office === 'DONE';

                                    let statusLabel = 'Waiting';
                                    let statusColor = 'text-zinc-300 bg-zinc-50 border-zinc-100';
                                    let Icon = Clock;

                                    if (hasPassed) {
                                        statusLabel = 'Verified';
                                        statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                                        Icon = CheckCircle2;
                                    } else if (isReturned) {
                                        statusLabel = 'Returned';
                                        statusColor = 'text-rose-600 bg-rose-50 border-rose-100';
                                        Icon = RefreshCcw;
                                    } else if (isCurrent) {
                                        statusLabel = isFinal ? 'Settled' : 'Pending Action';
                                        statusColor = isFinal ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-amber-600 bg-amber-50 border-amber-100';
                                        Icon = isFinal ? LayoutDashboard : Timer;
                                    }

                                    return (
                                        <div key={office} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCurrent ? 'ring-2 ring-indigo-500/20 border-indigo-100 bg-white' : 'border-zinc-50 bg-[#FCFDFF]'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${hasPassed ? 'bg-emerald-500 text-white' : isCurrent ? (isReturned ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white') : 'bg-zinc-100 text-zinc-400'}`}>
                                                    {isFinal && hasPassed ? <ShieldCheck className="h-5 w-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-black ${hasPassed ? 'text-zinc-500' : 'text-zinc-900'}`}>
                                                        {office === 'DONE' ? 'Treasury (Final Release)' : office}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        {office === 'Customer' ? 'Entry Point' : 'Verification Desk'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tighter ${statusColor}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {statusLabel}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Release Money Note */}
                            {cheque.status === 'PAID' && (
                                <div className="mt-8 p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-200 flex items-center justify-between overflow-hidden relative">
                                    <div className="absolute -right-4 -bottom-4 opacity-10">
                                        <ShieldCheck className="h-24 w-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Payment Status</p>
                                        <p className="text-xl font-black tracking-tight underline decoration-indigo-400 decoration-4 underline-offset-4">Funds Released</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="space-y-5">
                        {/* Office Efficiency Metrics */}
                        <div className="bg-white rounded-3xl border border-zinc-100 shadow-lg p-6">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 border-b border-zinc-50 pb-4">Verification Efficiency</p>
                            
                            <div className="space-y-5">
                                {officeStats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                            <span className="text-xs font-bold text-zinc-700">{stat.office}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                            <Timer className="h-3 w-3" />
                                            {stat.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-6 border-dashed border-zinc-100" />

                            <div className="space-y-4 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 shrink-0 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Timer className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total Time Elapsed</p>
                                        <p className="text-base font-black text-zinc-900">{hrs}h {mins}m</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                        <UserCog className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total Custodian</p>
                                        <p className="text-base font-black text-zinc-900">{cheque.currentOffice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-zinc-900 rounded-3xl p-5 text-white shadow-lg">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Quick Links</p>
                            <div className="space-y-1">
                                <Link
                                    href={`/admin/users?query=${cheque.accountName}`}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    <span className="text-xs font-semibold">User Profile</span>
                                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                                </Link>
                                <Link
                                    href="/admin/cheques"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    <span className="text-xs font-semibold">All Cheques</span>
                                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                                </Link>
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    <span className="text-xs font-semibold">Dashboard</span>
                                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
