'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft, CheckCircle2, ShieldCheck, UserCheck, KeyRound, AlertCircle,
    User, Hash, Phone, CalendarDays, Building2 as Building, FileText
} from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";

const DESTINATIONS = [
    {
        id: 'treasury',
        icon: '🏛️',
        name: 'Treasury',
        desc: 'Forward for high-value clearance'
    },
    {
        id: 'branch_controller',
        icon: '🏢',
        name: 'Branch Controller',
        desc: 'Return to controller for adjustments'
    },
    {
        id: 'customer_service',
        icon: '👤',
        name: 'Customer Service Review',
        desc: 'Escalate to senior customer service'
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

export default function TellerAuthorizePage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = mockCheques.find(c => c.id === id);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Destinations state
    const [showDestinations, setShowDestinations] = useState(false);
    const [selectedDest, setSelectedDest] = useState<string | null>(null);

    if (!cheque) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Accessing Authorization Records...</p>
            </div>
        </div>
    );

    const handleAuthorize = () => {
        if (!showDestinations) {
            setShowDestinations(true);
            return;
        }

        if (!selectedDest) return;

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/teller/dashboard');
            }, 2000);
        }, 1500);
    };

    return (
        <div
            className="min-h-screen bg-slate-50 pb-10"
            style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
        >
            {/* Top bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Abort Authorization
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-800">Final Authorization Workbench</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* -- LEFT PANEL -- */}
                                <div className="lg:col-span-3 space-y-6">

                                    {/* Amount Hero Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Settlement Value</p>
                                                <p className="text-4xl sm:text-5xl font-black tracking-tight">{formatCurrency(cheque.amount)}</p>
                                            </div>
                                            <div className="flex flex-col items-start sm:items-end gap-2">
                                                <span className="bg-white/15 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                                    #{cheque.chequeNumber}
                                                </span>
                                                <span className="text-white/50 text-xs text-right">Reference Verified</span>
                                            </div>
                                        </div>
                                    </motion.div>

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
                                                <p className="text-xs text-slate-400">Review all information provided by the customer</p>
                                            </div>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <DetailRow icon={User} label="Authorized Payee" value={cheque.accountName} />
                                            <DetailRow icon={Hash} label="Account Number" value={cheque.accountNumber} mono />
                                            <DetailRow icon={Phone} label="Phone" value={cheque.phoneNumber} />
                                            <DetailRow icon={Hash} label="Leaf Serial" value={cheque.chequeNumber} mono highlight />
                                            <DetailRow icon={CalendarDays} label="Submitted" value={formatDate(cheque.submittedAt)} />
                                            <DetailRow icon={Building} label="Branch" value={cheque.bankBranch} />
                                        </div>
                                    </motion.div>

                                    {/* Verification Badges */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
                                    >
                                        <h2 className="text-sm font-bold text-slate-900">Prior Authorizations</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Customer Service</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-widest">Approved</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Branch Controller</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                </div>

                                {/* -- RIGHT PANEL -- */}
                                <aside className="lg:col-span-2 h-fit space-y-6">
                                    <div className="bg-slate-900 rounded-3xl shadow-xl shadow-slate-200 border border-slate-800 p-8 text-white relative overflow-hidden flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <KeyRound className="h-48 w-48" />
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full space-y-8">
                                            <div>
                                                <h2 className="text-lg font-black text-white tracking-tight mb-2">Digital Signature</h2>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Commit transaction to archive</p>
                                            </div>

                                            <div className="flex flex-col space-y-8 flex-1">
                                                <AnimatePresence mode="wait">
                                                    {!showDestinations ? (
                                                        <motion.div key="sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="space-y-8">
                                                            <div className="flex gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                                                <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0" />
                                                                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                                                    Your digital signature will be logged as the final authorization for this transaction, triggering immediate fund release.
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={handleAuthorize}
                                                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm px-6 py-5 rounded-2xl transition-all shadow-lg shadow-indigo-900/50 active:scale-[0.98] group"
                                                            >
                                                                <UserCheck className="h-5 w-5 group-hover:scale-110 transition-transform" /> SIGN
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="destinations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Destination</p>

                                                            <div className="space-y-2">
                                                                {DESTINATIONS.map(dest => (
                                                                    <button
                                                                        key={dest.id}
                                                                        onClick={() => setSelectedDest(dest.id)}
                                                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${selectedDest === dest.id
                                                                            ? 'border-indigo-500 bg-indigo-500/20'
                                                                            : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/80'
                                                                            }`}
                                                                    >
                                                                        <span className="text-xl">{dest.icon}</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-sm font-bold ${selectedDest === dest.id ? 'text-indigo-400' : 'text-slate-200'}`}>{dest.name}</p>
                                                                            <p className="text-[10px] text-slate-500 truncate">{dest.desc}</p>
                                                                        </div>
                                                                        {selectedDest === dest.id && <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="pt-4 flex gap-2">
                                                                <button
                                                                    onClick={() => setShowDestinations(false)}
                                                                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-800 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleAuthorize}
                                                                    disabled={!selectedDest || isProcessing}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                </aside>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                className="mb-10 rounded-[4rem] bg-indigo-100 p-14 shadow-2xl shadow-indigo-50"
                            >
                                <ShieldCheck className="h-32 w-32 text-indigo-600" />
                            </motion.div>
                            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Signature Confirmed</h2>
                            <p className="text-slate-500 mb-12 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                                Digital authorization key generated. Transaction moved to {DESTINATIONS.find(d => d.id === selectedDest)?.name}.
                            </p>
                            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 animate-pulse">
                                Secure Session Closing...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
