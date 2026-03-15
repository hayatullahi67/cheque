'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle2, User, Building2, Calendar,
    ShieldCheck, Wallet, Image as ImageIcon, X, Zap,
    Activity, ArrowUpRight, Copy, FileText, Download, CheckCircle,
    Stamp, AlertCircle, ArrowRight, Clock, Hash, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency, formatDate } from "@/lib/helpers";
import { mockCheques } from "@/lib/mock-data";
import { CountdownTimer } from "@/components/countdown/CountdownTimer";

const DESTINATIONS = [
    {
        id: 'customer_service',
        icon: '👤',
        name: 'Customer Service',
        desc: 'Return for clarification or corrections'
    },
    {
        id: 'teller',
        icon: '💳',
        name: 'Teller',
        desc: 'Forward for final payment authorization'
    },
    {
        id: 'treasury',
        icon: '🏛️',
        name: 'Treasury',
        desc: 'Forward for high-value clearance'
    }
];

function StatCard({ label, value, icon: Icon, subValue }: { label: string; value: string; icon: any; subValue?: string }) {
    return (
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
                <div className="min-w-0 pr-4">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-xl font-bold text-zinc-900 truncate">{value}</p>
                    {subValue && <p className="text-sm font-medium text-zinc-500 mt-1 truncate">{subValue}</p>}
                </div>
                <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function BranchVerifyPage() {
    const router = useRouter();
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Backend logic states
    const [isVerified, setIsVerified] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDestinations, setShowDestinations] = useState(false);
    const [selectedDest, setSelectedDest] = useState<string | null>(null);

    // Fetch real data
    const cheque = useMemo(() => {
        const found = mockCheques.find(c => c.id === id);
        return found || {
            id: id as string || 'CHQ-9921',
            amount: 750000,
            status: 'PROCESSING',
            oidMatch: '000123456789',
            bankBranch: 'Main Digital Node',
            submittedAt: new Date().toISOString(),
            currentOffice: 'Branch Controller',
            accountName: 'Alexander Wright',
            accountNumber: '**** **** 4321',
            requestType: 'WITHDRAWAL',
            chequeNumber: 'CHQ-000000',
            imageUrl: ''
        };
    }, [id]);

    const isWithdrawal = cheque.requestType === 'WITHDRAWAL';

    const handleCopy = () => {
        navigator.clipboard.writeText(cheque.oidMatch || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = () => {
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); setIsVerified(true); }, 1500);
    };

    const handleSendTo = () => {
        if (!selectedDest) return;
        router.push('/branch-controller/dashboard');
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased pb-20">
            {/* Header */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-colors shadow-sm"
                        >
                            <ArrowLeft className="h-5 w-5 text-zinc-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-zinc-900 hidden sm:block">Verify Cheque</h1>
                                <span className={cn(
                                    "px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold border",
                                    isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"
                                )}>
                                    {isVerified ? 'VERIFIED' : cheque.status}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-zinc-500 mt-1">Ref: {cheque.id} • Leaf: {cheque.chequeNumber}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Main Actions & Stats */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Amount Hero Card */}
                        <div className={cn(
                            "rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden transition-all duration-500",
                            isVerified
                                ? "bg-gradient-to-br from-emerald-600 to-emerald-800"
                                : "bg-gradient-to-br from-indigo-900 to-indigo-950"
                        )}>
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 bg-white/5 h-80 w-80 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 bg-white/5 h-80 w-80 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div>
                                    {/* <p className="text-white/60 font-semibold mb-2 uppercase tracking-wider text-xs">Cheque Value</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight whitespace-nowrap">
                                            {formatCurrency(cheque.amount)}
                                        </h2>
                                    </div> */}
                                    <div className="mt-8 flex items-center gap-3 sm:gap-6 flex-wrap">
                                        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                            <Activity className={cn("h-4 w-4", isVerified ? "text-white" : "text-emerald-400")} />
                                            <span className="text-sm font-bold text-white uppercase tracking-widest">{isVerified ? "Ready to forward" : "Verification in Progress"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                                            <Calendar className="h-4 w-4 opacity-70" />
                                            {formatDate(cheque.submittedAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-4 sm:p-5 rounded-3xl backdrop-blur-md border border-white/20 w-full sm:w-auto min-w-[240px] shrink-0 mt-6 sm:mt-0 shadow-lg">
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-black mb-2.5">OID Tracking Number</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm sm:text-base font-mono font-black tracking-widest bg-black/20 px-4 py-2.5 rounded-2xl flex-1 text-center truncate border border-white/5 shadow-inner">
                                            {cheque.oidMatch || 'NOT_AVAILABLE'}
                                        </p>
                                        <button
                                            onClick={handleCopy}
                                            className="h-[44px] w-[44px] shrink-0 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 hover:scale-105"
                                            title="Copy OID"
                                        >
                                            {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-4 px-1">Instrument Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <StatCard icon={User} label="Primary Holder" value={cheque.accountName} subValue={`A/C: ${cheque.accountNumber}`} />
                                <StatCard icon={Building2} label="Originating Node" value={cheque.bankBranch} subValue="Branch Verification Required" />
                            </div>
                        </div>

                        {/* Verification Path */}
                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-zinc-900 mb-4 px-1">Verification Path</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['Customer Service', 'Branch Controller', 'Teller', 'DONE'].map((step, i) => {
                                    const offices = ['Customer Service', 'Branch Controller', 'Teller', 'DONE'];
                                    const currentIdx = offices.indexOf(cheque.currentOffice) !== -1 ? offices.indexOf(cheque.currentOffice) : 1;
                                    const stepOrigIdx = offices.indexOf(step);

                                    const isPast = stepOrigIdx < currentIdx || (stepOrigIdx === currentIdx && isVerified);
                                    const isCurrent = stepOrigIdx === currentIdx && !isVerified;

                                    const stepLabel = step === 'DONE' ? 'Settlement' : step;

                                    return (
                                        <div key={step} className={cn(
                                            "rounded-2xl p-4 border flex flex-col min-h-[110px] justify-between transition-all",
                                            isCurrent ? "bg-indigo-50 border-indigo-200 shadow-sm" :
                                                isPast ? "bg-white border-zinc-200" : "bg-zinc-50 border-zinc-200/50"
                                        )}>
                                            <div className={cn(
                                                "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mb-3",
                                                isPast ? "bg-emerald-500 text-white" :
                                                    isCurrent ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-400 border border-zinc-200/50"
                                            )}>
                                                {isPast ? <CheckCircle2 className="h-4 w-4" /> :
                                                    isCurrent ? <div className="h-2 w-2 bg-white rounded-full animate-pulse" /> :
                                                        <span className="text-[10px] font-bold">{i + 1}</span>}
                                            </div>

                                            <div>
                                                <p className={cn(
                                                    "text-xs font-bold uppercase tracking-wider leading-tight",
                                                    isPast ? "text-zinc-900" : isCurrent ? "text-indigo-800" : "text-zinc-600"
                                                )}>{stepLabel}</p>
                                                <p className={cn(
                                                    "text-[10px] font-bold mt-1 uppercase tracking-widest",
                                                    isPast ? "text-emerald-600" : isCurrent ? "text-indigo-600" : "text-zinc-500"
                                                )}>
                                                    {isPast ? 'Verified' : isCurrent ? 'Active Now' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Verification Logic & Proof */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Action Panel Container */}
                        <Card className="rounded-[2rem] p-6 sm:p-8 border-none shadow-xl bg-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                        <Stamp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Leaf Verification</h4>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-0.5">BC Authorization Desk</p>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!isVerified ? (
                                        <motion.div key="verify-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                                <div className="flex gap-3">
                                                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-wider">
                                                        Please confirm the physical document matches the OID record and apply the branch stamp.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleVerify}
                                                disabled={isProcessing}
                                                className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>Verify</>
                                                )}
                                            </button>
                                        </motion.div>
                                    ) : !showDestinations ? (
                                        <motion.div key="forward-form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">Authentication Seal Applied</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Record Updated Successfully</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowDestinations(true)}
                                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100"
                                            >
                                                Select Forward Route <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="destinations-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Choose Next Station</p>
                                            {DESTINATIONS.map(dest => (
                                                <button
                                                    key={dest.id}
                                                    onClick={() => setSelectedDest(dest.id)}
                                                    className={cn(
                                                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                                        selectedDest === dest.id
                                                            ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                                            : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                                                    )}
                                                >
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-xl shadow-sm italic font-serif">
                                                        {dest.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn("text-xs font-black uppercase tracking-widest", selectedDest === dest.id ? "text-indigo-900" : "text-zinc-700")}>{dest.name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold mt-0.5 truncate">{dest.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                            <div className="pt-4 flex gap-3">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowDestinations(false)}
                                                    className="flex-1 bg-zinc-50 font-black text-[10px] uppercase tracking-widest h-12 rounded-xl"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    disabled={!selectedDest}
                                                    onClick={handleSendTo}
                                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-emerald-50"
                                                >
                                                    Complete Forward
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Countdown Logic */}
                                <AnimatePresence>
                                    {isVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-4"
                                        >
                                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Time Remaining to Settle</p>
                                                <CountdownTimer className="text-xl font-black text-indigo-600 tracking-tight" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>

                        {/* Document Proof Section */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm text-center flex flex-col items-center group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                            <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-50 group-hover:bg-indigo-50 border border-zinc-200 group-hover:border-indigo-100 flex items-center justify-center mb-4 transition-colors">
                                <ImageIcon className="h-6 w-6 text-zinc-500 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Document Evidence</h4>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1 mb-6">Physical Instrument Scan</p>

                            <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-200 mb-6 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                <div className="aspect-[4/3] bg-zinc-100 w-full relative">
                                    <img
                                        src={cheque.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt="Cheque Proof"
                                    />
                                    <div className="absolute inset-0 bg-zinc-900/0 opacity-0 group-hover:opacity-100 group-hover:bg-zinc-900/40 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white/90 p-3 rounded-full flex items-center justify-center">
                                            <ArrowUpRight className="h-6 w-6 text-zinc-900" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-xl py-6 font-black text-[10px] uppercase tracking-widest"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Full Screen Inspect
                            </Button>
                        </div>

                    </div>
                </div>
            </main>

            {/* Document Inspection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-zinc-900/90 backdrop-blur-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-3 max-w-5xl w-full relative shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-10 left-10 z-10 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] shadow-xl border border-zinc-100 flex items-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Security Authenticated
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-10 right-10 z-10 h-12 w-12 bg-white/95 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <div className="p-4 sm:p-6 flex min-h-[60vh] items-center justify-center bg-zinc-50 rounded-[2rem] border border-zinc-100">
                                <img
                                    src={cheque.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80"}
                                    className="w-full max-h-[80vh] object-contain shadow-2xl rounded-2xl"
                                    alt="High Resolution Proof"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
