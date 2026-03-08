'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, CheckCircle2, RefreshCcw, ShieldCheck, AlertCircle,
    FileText, User, Building2 as Building, Hash, CalendarDays, Banknote, Clock,
    ChevronRight, Sparkles, Phone, MapPin
} from "lucide-react";

const DESTINATIONS = [
    {
        id: 'branch_controller',
        icon: '🏢',
        name: 'Branch Controller',
        desc: 'Forward for physical leaf verification'
    },
    {
        id: 'customer_service',
        icon: '👤',
        name: 'Customer Service Review',
        desc: 'Escalate to senior customer service'
    },
    {
        id: 'treasury',
        icon: '🏛️',
        name: 'Treasury',
        desc: 'Forward for high-value clearance'
    }
];

function DetailRow({ icon: Icon, label, value, mono = false, highlight = false }: {
    icon: any; label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                <Icon className="h-3 w-3" /> {label}
            </span>
            <span className={`text-sm font-bold ${mono ? 'font-mono' : ''} ${highlight ? 'text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block w-fit' : 'text-slate-800'}`}>
                {value}
            </span>
        </div>
    );
}

export default function CSReviewPage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = mockCheques.find(c => c.id === id);

    const [isSuccess, setIsSuccess] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'return' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // New state for the destination selection
    const [showDestinations, setShowDestinations] = useState(false);
    const [selectedDest, setSelectedDest] = useState<string | null>(null);

    if (!cheque) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading submission details...</p>
            </div>
        </div>
    );

    const handleAction = (type: 'approve' | 'return') => {
        if (type === 'approve' && !showDestinations) {
            setShowDestinations(true);
            return;
        }

        if (type === 'approve' && !selectedDest) return; // Must select a destination

        setActionType(type);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => router.push('/customer-service/dashboard'), 2400);
        }, 1600);
    };

    return (
        <div
            className="min-h-screen bg-slate-50"
            style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
        >
            {/* Top bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-800">Submission Review</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.35 }}
                        >
                            {/* Amount Hero Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl mb-6 relative overflow-hidden"
                            >
                                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                                />
                                <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

                                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Claimed Amount</p>
                                        <p className="text-4xl sm:text-5xl font-black tracking-tight">{formatCurrency(cheque.amount)}</p>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-2">
                                        <span className="bg-white/10 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 font-mono">
                                            #{cheque.chequeNumber}
                                        </span>
                                        <Badge status={cheque.status} />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* ── LEFT PANEL (main content) ──────── */}
                                <div className="lg:col-span-2 space-y-5">

                                    {/* Full Cheque Details */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                                    >
                                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900">Digital Submission Details</h2>
                                                <p className="text-xs text-slate-400">Review all information provided by the user</p>
                                            </div>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <DetailRow icon={User} label="Beneficiary" value={cheque.accountName} />
                                            <DetailRow icon={Hash} label="Account Number" value={cheque.accountNumber} mono />
                                            <DetailRow icon={Phone} label="Phone" value={cheque.phoneNumber} />
                                            <DetailRow icon={Hash} label="Leaf Serial" value={cheque.chequeNumber} mono highlight />
                                            <DetailRow icon={CalendarDays} label="Submitted" value={formatDate(cheque.submittedAt)} />
                                            <DetailRow icon={Building} label="Branch" value={cheque.bankBranch} />
                                        </div>
                                    </motion.div>

                                    {/* Notes */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-amber-50/50">
                                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Internal Review Notes (Optional)</p>
                                        </div>
                                        <textarea
                                            rows={4}
                                            className="w-full p-5 text-sm text-slate-600 placeholder:text-slate-300 outline-none resize-none bg-transparent focus:bg-amber-50/20 transition-colors"
                                            placeholder="Add review notes or instructions before forwarding…"
                                        />
                                    </div>
                                </div>

                                {/* ── RIGHT PANEL (action sidebar) ───── */}
                                <div className="space-y-4 lg:sticky lg:top-28 h-fit">
                                    {/* Checklist */}
                                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
                                        <div>
                                            <h3 className="font-black text-slate-900 text-base tracking-tight">Pre-Approval Checklist</h3>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">Verify before signing off</p>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                "Identity documents match account name",
                                                "Amount is within daily limit",
                                                "No duplicate submission found",
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-slate-600 font-medium leading-snug">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Card */}
                                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                                <ShieldCheck className="h-5 w-5 text-zinc-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white text-sm tracking-tight leading-none">Make a Decision</h3>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Complete review</p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-3">
                                            {/* Forward / Approve Workflow */}
                                            <AnimatePresence mode="wait">
                                                {!showDestinations ? (
                                                    <motion.div key="initial-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleAction('approve')}
                                                            className="w-full flex items-center justify-between gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-5 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/30 group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                                                <div className="text-left">
                                                                    <p className="text-sm font-black leading-none">Approve & Forward</p>
                                                                    <p className="text-[9px] text-emerald-100/70 font-bold mt-0.5 uppercase tracking-widest">Select destination</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleAction('return')}
                                                            disabled={isProcessing}
                                                            className="w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-amber-500/10 disabled:opacity-60 text-zinc-300 hover:text-amber-300 font-black px-5 py-4 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <RefreshCcw className="h-5 w-5 shrink-0 group-hover:rotate-180 transition-transform duration-500" />
                                                                <div className="text-left">
                                                                    <p className="text-sm font-black leading-none">Return for Adjustment</p>
                                                                    <p className="text-[9px] text-zinc-600 font-bold mt-0.5 uppercase tracking-widest">Send back to Customer</p>
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="destinations" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="space-y-3 overflow-hidden">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Select Destination</p>
                                                        {DESTINATIONS.map(dest => (
                                                            <button
                                                                key={dest.id}
                                                                onClick={() => setSelectedDest(dest.id)}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${selectedDest === dest.id
                                                                        ? 'border-emerald-500 bg-emerald-500/10'
                                                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <span className="text-xl">{dest.icon}</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-bold ${selectedDest === dest.id ? 'text-emerald-400' : 'text-zinc-200'}`}>{dest.name}</p>
                                                                    <p className="text-xs text-zinc-500 truncate">{dest.desc}</p>
                                                                </div>
                                                                {selectedDest === dest.id && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                                                            </button>
                                                        ))}

                                                        <div className="pt-2 flex gap-2">
                                                            <button
                                                                onClick={() => setShowDestinations(false)}
                                                                className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-sm font-bold hover:bg-white/5 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction('approve')}
                                                                disabled={!selectedDest || isProcessing}
                                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                                            >
                                                                {isProcessing ? (
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <>Confirm</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* ── Success State ────────────────────────── */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 14, stiffness: 120 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1, type: "spring", damping: 12, stiffness: 100 }}
                                className={`mb-8 h-32 w-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl ${actionType === 'approve'
                                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-300/40'
                                    : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-300/40'
                                    }`}
                            >
                                {actionType === 'approve'
                                    ? <ShieldCheck className="h-16 w-16 text-white" />
                                    : <RefreshCcw className="h-16 w-16 text-white" />
                                }
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                                    {actionType === 'approve' ? 'Cheque Approved' : 'Returned Successfully'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                                    {actionType === 'approve'
                                        ? `Digital submission verified. Forwarded to the selected department.`
                                        : 'Cheque has been returned to the customer for document correction.'
                                    }
                                </p>

                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 animate-pulse"
                                >
                                    <Sparkles className="h-3.5 w-3.5" /> Returning to workspace…
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
