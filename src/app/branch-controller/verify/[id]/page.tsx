

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/countdown/CountdownTimer";
import {
    ShieldCheck, ArrowLeft, Stamp, FileText, CheckCircle2,
    AlertCircle, ArrowRight, User, Calendar, MapPin, Hash,
    Phone, ChevronRight, Clock, Building2
} from "lucide-react";
import { mockCheques, mockUsers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { UserRole } from "@/lib/constants";

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

export default function BranchVerifyPage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = mockCheques.find(c => c.id === id);
    const [isVerified, setIsVerified] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDestinations, setShowDestinations] = useState(false);
    const [selectedDest, setSelectedDest] = useState<string | null>(null);

    if (!cheque) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading cheque details...</p>
            </div>
        </div>
    );

    const handleVerify = () => {
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); setIsVerified(true); }, 1500);
    };

    const handleSendTo = () => {
        if (!selectedDest) return;
        router.push('/branch-controller/dashboard');
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
                    <ShieldCheck className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-800">Cheque Verification</span>
                </div>
                <AnimatePresence>
                    {isVerified && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="ml-auto flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">

                {/* Amount Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
                        isVerified
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-200'
                            : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Cheque Amount</p>
                            <p className="text-4xl sm:text-5xl font-black tracking-tight">{formatCurrency(cheque.amount)}</p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className="bg-white/15 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                #{cheque.chequeNumber}
                            </span>
                            <span className="text-white/50 text-xs">{formatDate(cheque.submittedAt)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Cheque Details — takes 3 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Submission Details</h2>
                                <p className="text-xs text-slate-400">Digital record to validate against physical leaf</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DetailRow icon={User} label="Beneficiary" value={cheque.accountName} />
                            <DetailRow icon={Hash} label="Account Number" value={cheque.accountNumber} mono />
                            <DetailRow icon={Phone} label="Phone" value={cheque.phoneNumber} />
                            <DetailRow icon={Hash} label="Leaf Serial" value={cheque.chequeNumber} mono highlight />
                            <DetailRow icon={Calendar} label="Submitted" value={formatDate(cheque.submittedAt)} />
                            <DetailRow icon={Building2} label="Branch" value={cheque.bankBranch} />
                        </div>
                    </motion.div>

                    {/* Action Panel — takes 2 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="lg:col-span-2 flex flex-col gap-4"
                    >
                        {/* Action card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex-1">
                            <h2 className="text-sm font-bold text-slate-900 mb-1">Action Required</h2>
                            <p className="text-xs text-slate-400 mb-5">Confirm physical leaf has been stamped and is in your possession.</p>

                            <AnimatePresence mode="wait">
                                {!isVerified ? (
                                    <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                                Ensure the physical cheque leaf is in hand and matches the details above before proceeding.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleVerify}
                                            disabled={isProcessing}
                                            className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm px-6 py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? (
                                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</>
                                            ) : (
                                                <><Stamp className="h-4 w-4" /> Verify & Stamp Leaf</>
                                            )}
                                        </button>
                                    </motion.div>
                                ) : !showDestinations ? (
                                    <motion.div key="verified" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-800">Leaf Authenticated</p>
                                                <p className="text-xs text-emerald-600 mt-0.5">Physical stamping complete. Ready to forward.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowDestinations(true)}
                                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-sm px-6 py-4 rounded-xl transition-all"
                                        >
                                            Forward Cheque <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="destinations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Destination</p>
                                        {DESTINATIONS.map(dest => (
                                            <button
                                                key={dest.id}
                                                onClick={() => setSelectedDest(dest.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                                                    selectedDest === dest.id
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-xl">{dest.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold ${selectedDest === dest.id ? 'text-indigo-700' : 'text-slate-800'}`}>{dest.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{dest.desc}</p>
                                                </div>
                                                {selectedDest === dest.id && <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />}
                                            </button>
                                        ))}
                                        <div className="pt-2 flex gap-2">
                                            <button
                                                onClick={() => setShowDestinations(false)}
                                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSendTo}
                                                disabled={!selectedDest}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> Confirm
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Timer — only show when verified */}
                        <AnimatePresence>
                            {isVerified && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
                                >
                                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Processing Window</p>
                                        <CountdownTimer className="text-indigo-600 font-black text-xl" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


