// 'use client';

// import { useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { Card, CardHeader } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { ArrowLeft, CheckCircle2, Banknote, Receipt, ShieldCheck } from "lucide-react";
// import { mockCheques } from "@/lib/mock-data";
// import { formatCurrency } from "@/lib/helpers";
// import { motion } from "framer-motion";

// export default function TreasuryPaymentPage() {
//     const router = useRouter();
//     const { id } = useParams();
//     const cheque = mockCheques.find(c => c.id === id);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     if (!cheque) return <div className="p-20 text-center animate-pulse font-black text-zinc-400 uppercase tracking-widest">Accessing Vault...</div>;

//     const handleRelease = () => {
//         setIsProcessing(true);
//         setTimeout(() => {
//             setIsProcessing(false);
//             setIsSuccess(true);
//             setTimeout(() => {
//                 router.push('/treasury/dashboard');
//             }, 2500);
//         }, 1800);
//     };

//     return (
//         <div className="animate-in max-w-5xl mx-auto py-4">
//             {!isSuccess ? (
//                 <>
//                     <Button variant="ghost" onClick={() => router.back()} className="mb-8 -ml-2 text-zinc-400 hover:text-zinc-900 font-black text-[10px]">
//                         <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Transaction
//                     </Button>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                         <div className="lg:col-span-2">
//                             <Card className="p-12 border-transparent shadow-2xl ring-1 ring-zinc-50 relative overflow-hidden bg-white">
//                                 <div className="absolute top-0 right-0 p-8 opacity-5">
//                                     <Receipt className="h-64 w-64 rotate-12" />
//                                 </div>
//                                 <div className="relative z-10">
//                                     <div className="flex items-center gap-3 mb-10">
//                                         <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
//                                             <Banknote className="h-6 w-6" />
//                                         </div>
//                                         <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Payment Voucher</h2>
//                                     </div>

//                                     <div className="space-y-12">
//                                         <div className="flex flex-col gap-2 relative">
//                                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Verified Beneficiary</p>
//                                             <p className="text-5xl font-black text-zinc-900 tracking-tighter leading-none">{cheque.accountName}</p>
//                                         </div>

//                                         <div className="grid grid-cols-2 gap-12 pt-4">
//                                             <div>
//                                                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Leaf Serial Number</p>
//                                                 <div className="bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 inline-block font-mono font-black text-zinc-600 text-lg">
//                                                     {cheque.chequeNumber}
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Settlement Amount</p>
//                                                 <p className="text-5xl font-black text-emerald-600 tracking-tighter">{formatCurrency(cheque.amount)}</p>
//                                             </div>
//                                         </div>

//                                         <div className="pt-10 border-t border-zinc-50 flex items-center gap-4 text-emerald-700">
//                                             <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
//                                                 <ShieldCheck className="h-4 w-4" />
//                                             </div>
//                                             <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
//                                                 Teller Authorization Verified & Digital Signature Matched Successfully.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card>
//                         </div>

//                         <aside className="space-y-6">
//                             <Card className="p-10 border-none shadow-2xl shadow-zinc-200 bg-[#09090B] text-white">
//                                 <h4 className="text-xl font-black tracking-tight mb-6">Action Panel</h4>
//                                 <div className="space-y-8 mt-4">
//                                     <p className="text-xs text-zinc-500 leading-relaxed font-bold uppercase tracking-wider">
//                                         By releasing cash, you confirm that physical funds have been disbursed to the authorized collector.
//                                     </p>
//                                     <Button
//                                         className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-20 text-xl font-black shadow-xl shadow-emerald-900/40 rounded-2xl group"
//                                         isLoading={isProcessing}
//                                         onClick={handleRelease}
//                                     >
//                                         <Banknote className="mr-3 h-8 w-8 group-hover:rotate-12 transition-transform" /> RELEASE CASH
//                                     </Button>
//                                     <div className="text-center">
//                                         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
//                                             Transaction will be sealed<br />and archived immediately
//                                         </p>
//                                     </div>
//                                 </div>
//                             </Card>
//                         </aside>
//                     </div>
//                 </>
//             ) : (
//                 <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <motion.div
//                         initial={{ scale: 0.5, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         transition={{ type: "spring", stiffness: 100, damping: 10 }}
//                         className="mb-10 rounded-[3rem] bg-emerald-100 p-12 shadow-2xl shadow-emerald-50"
//                     >
//                         <CheckCircle2 className="h-24 w-24 text-emerald-600" />
//                     </motion.div>
//                     <h2 className="text-5xl font-black text-zinc-900 mb-4 tracking-tighter">Payment Disbursed</h2>
//                     <p className="text-zinc-500 mb-12 text-lg font-medium">The vault record has been updated and the transaction is closed.</p>
//                     <div className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-200 animate-pulse">
//                         Closing Digital Terminal
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle2, Banknote, Receipt,
    ShieldCheck, Clock, User, Hash, AlertCircle,
    Lock, ChevronRight
} from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────
   HOOK: live clock
───────────────────────────────────── */
function useClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () =>
            setTime(new Date().toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

/* ─────────────────────────────────────
   ATOM: labeled detail box
───────────────────────────────────── */
function DetailBox({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 sm:px-4 py-3 min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">
                {label}
            </p>
            {children}
        </div>
    );
}

/* ─────────────────────────────────────
   ATOM: verification badge
───────────────────────────────────── */
function VerifyBadge({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 leading-tight">{label}</span>
        </div>
    );
}

/* ─────────────────────────────────────
   COMPONENT: Action Panel
   (shared between mobile inline + desktop sidebar)
───────────────────────────────────── */
function ActionPanel({ confirmed, setConfirmed, isProcessing, onRelease }: {
    confirmed: boolean;
    setConfirmed: (val: boolean) => void;
    isProcessing: boolean;
    onRelease: () => void;
}) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Release Funds Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="p-4 sm:p-6 space-y-4">

                    <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Release Funds</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Confirm physical cash has been counted and is ready to hand to the authorized collector.
                        </p>
                    </div>

                    {/* Checkbox — extra-large touch target on mobile */}
                    <label className="flex items-start gap-3 cursor-pointer group select-none -mx-1 px-1 py-1 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="relative mt-0.5 shrink-0">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={confirmed}
                                onChange={e => setConfirmed(e.target.checked)}
                            />
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150
                                ${confirmed
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-slate-300 group-hover:border-emerald-400'}`}
                            >
                                {confirmed && (
                                    <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white stroke-[2.5]">
                                        <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-xs text-slate-600 leading-relaxed font-medium">
                            I confirm that the collector's identity has been verified and funds are ready for disbursement.
                        </span>
                    </label>

                    {/* Animated warning */}
                    <AnimatePresence>
                        {!confirmed && (
                            <motion.div
                                key="warn"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                                        Tick the box above to enable cash release.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA — minimum 48px height for mobile tap targets */}
                    <button
                        onClick={onRelease}
                        disabled={!confirmed || isProcessing}
                        className={`w-full flex items-center justify-center gap-2.5 rounded-xl px-4 py-4
                            text-sm font-extrabold tracking-wide transition-all duration-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                            ${confirmed && !isProcessing
                                ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-lg shadow-emerald-200 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'}`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Processing…
                            </>
                        ) : (
                            <>
                                <Banknote className="h-5 w-5" />
                                Release Cash Now
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                        This action is <strong className="text-slate-500">irreversible</strong>.
                        {' '}The transaction will be sealed and archived immediately.
                    </p>
                </div>
            </div>

            {/* Encrypted session note */}
            <div className="bg-slate-800 rounded-2xl px-4 sm:px-5 py-4 flex items-start gap-3">
                <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                    This session is <strong className="text-slate-300">encrypted</strong>.
                    {' '}All disbursement actions are logged with your operator ID and timestamp.
                </p>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════ */
export default function TreasuryPaymentPage() {
    const router = useRouter();
    const { id } = useParams();
    const cheque = mockCheques.find(c => c.id === id);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const timestamp = useClock();

    /* ── not found state ── */
    if (!cheque) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 px-6">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Retrieving Record…</p>
        </div>
    );

    const handleRelease = () => {
        if (!confirmed || isProcessing) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => router.push('/treasury/dashboard'), 3200);
        }, 2000);
    };

    const voucherID = `#TRX-${cheque.chequeNumber ?? cheque.id?.toUpperCase?.() ?? '000001'}`;
    const payDate = cheque.submittedAt
        ? new Date(cheque.submittedAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        })
        : new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

    /* ── shared sticky header ── */
    const Header = () => (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shrink-0 gap-2">
            {/* Left: back + breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-500
                               hover:text-slate-900 transition-colors group shrink-0 p-1 -m-1 rounded-lg
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* divider + breadcrumb hidden on xs */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 min-w-0 overflow-hidden">
                    <div className="w-px h-3.5 bg-slate-200 shrink-0 ml-1" />
                    <span className="shrink-0 ml-1">Treasury</span>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    <span className="hidden md:inline shrink-0">Cash Disbursements</span>
                    <ChevronRight className="hidden md:block h-3 w-3 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">Release Payment</span>
                </div>

                {/* xs-only: just show page name */}
                <span className="sm:hidden text-sm font-semibold text-slate-700 truncate">Release Payment</span>
            </div>

            {/* Right: clock */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 shrink-0 font-mono">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                {/* full date + time on sm+, time only on xs */}
                <span className="hidden sm:inline">{timestamp}</span>
                <span className="sm:hidden">{timestamp.split(',')[1]?.trim() ?? ''}</span>
            </div>
        </header>
    );

    /* ══ SUCCESS STATE ══ */
    if (isSuccess) return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.15 }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center
                                   justify-center mx-auto mb-6 shadow-xl shadow-emerald-100"
                    >
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
                        Payment Released
                    </h2>
                    <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed px-2">
                        <strong className="text-slate-700">{formatCurrency(cheque.amount)}</strong> successfully
                        disbursed to <strong className="text-slate-700">{cheque.accountName}</strong>.
                        Transaction sealed and archived.
                    </p>

                    {/* Receipt */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-7">
                        {[
                            { label: 'Cheque Number', value: cheque.chequeNumber },
                            { label: 'Beneficiary', value: cheque.accountName },
                            { label: 'Amount', value: formatCurrency(cheque.amount) },
                            { label: 'Status', value: '✓ Disbursed', highlight: true },
                        ].map((row, i, arr) => (
                            <div
                                key={row.label}
                                className={`flex items-center justify-between px-4 sm:px-5 py-3.5
                                    ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                            >
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0">
                                    {row.label}
                                </span>
                                <span className={`text-sm font-bold ml-3 text-right truncate max-w-[55%]
                                    ${row.highlight ? 'text-emerald-600' : 'text-slate-800'}`}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                        Returning to Dashboard…
                    </div>
                </motion.div>
            </div>
        </div>
    );

    /* ══ MAIN FORM ══ */
    return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                /* safe area bottom padding for iOS home bar */
                className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-8 space-y-4 sm:space-y-5"
            >
                {/* ── Page heading ── */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Cash Disbursement
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                            Review payment details carefully before releasing funds
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700
                                     border border-amber-200 rounded-full px-2.5 sm:px-3 py-1
                                     text-[10px] sm:text-xs font-bold whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        Awaiting Release
                    </span>
                </div>

                {/* ── Grid: 1-col mobile / 2-col desktop ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5">

                    {/* ════ LEFT: Voucher details ════ */}
                    <div className="space-y-4 min-w-0">

                        {/* Payment Voucher card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

                            <div className="p-4 sm:p-6 sm:p-7">

                                {/* card header */}
                                <div className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                            <Receipt className="text-blue-600" style={{ width: 16, height: 16 }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                Payment Voucher
                                            </p>
                                            <p className="text-xs sm:text-sm font-bold text-slate-700">
                                                Cheque Encashment
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                                            Voucher ID
                                        </p>
                                        <p className="font-mono text-[11px] sm:text-sm font-bold text-slate-600">
                                            {voucherID}
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-slate-100 mb-4 sm:mb-5" />

                                {/* Beneficiary */}
                                <div className="mb-4">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        Beneficiary Name
                                    </p>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 sm:px-4 py-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate min-w-0 flex-1">
                                            {cheque.accountName}
                                        </p>
                                        <div className="flex items-center gap-1 text-emerald-600 shrink-0">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            <span className="text-[10px] sm:text-xs font-bold hidden xs:inline">
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cheque + Date grid */}
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
                                    <DetailBox label="Cheque Number">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <Hash className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-700 truncate">
                                                {cheque.chequeNumber}
                                            </span>
                                        </div>
                                    </DetailBox>
                                    <DetailBox label="Payment Date">
                                        <p className="text-xs sm:text-sm font-bold text-slate-700">{payDate}</p>
                                    </DetailBox>
                                </div>

                                {/* Amount */}
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl px-4 sm:px-6 py-4 sm:py-5 text-white">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">
                                        Settlement Amount
                                    </p>
                                    {/* break-all prevents overflow on tiny screens */}
                                    <p className="text-2xl sm:text-4xl font-extrabold tracking-tight break-all leading-tight">
                                        {formatCurrency(cheque.amount)}
                                    </p>
                                    <p className="text-[10px] sm:text-[11px] text-blue-200 mt-1.5 font-medium">
                                        Cash to be disbursed to verified collector
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verification checks */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4">
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Verification Checks
                            </p>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <VerifyBadge label="Signature Match" />
                                <VerifyBadge label="ID Verified" />
                                <VerifyBadge label="Funds Available" />
                            </div>
                        </div>

                        {/*
                         * On MOBILE (<lg): action panel sits here — right below voucher,
                         * no horizontal sidebar to scroll past.
                         * On DESKTOP (lg+): hidden here, shown in right column.
                         */}
                        <div className="lg:hidden">
                            <ActionPanel
                                confirmed={confirmed}
                                setConfirmed={setConfirmed}
                                isProcessing={isProcessing}
                                onRelease={handleRelease}
                            />
                        </div>

                    </div>{/* end left column */}

                    {/* ════ RIGHT: Sidebar (desktop only) ════ */}
                    <div className="hidden lg:flex flex-col gap-4">
                        <ActionPanel
                            confirmed={confirmed}
                            setConfirmed={setConfirmed}
                            isProcessing={isProcessing}
                            onRelease={handleRelease}
                        />
                    </div>

                </div>
            </motion.main>
        </div>
    );
}