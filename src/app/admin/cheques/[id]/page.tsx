'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, CheckCircle2, User, Building2, Calendar, 
    ShieldCheck, Wallet, Image as ImageIcon, X, Zap, 
    Activity, ArrowUpRight, Copy, FileText, Download, CheckCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency, formatDate } from "@/lib/helpers";
import { mockCheques } from "@/lib/mock-data";

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

export default function AdminChequeDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fetch the real cheque data
    const chequeData = useMemo(() => mockCheques.find(c => c.id === id), [id]);

    const chequeResource = useMemo(() => {
        if (!chequeData) return null;
        return {
            id: chequeData.id,
            amount: chequeData.amount,
            status: chequeData.status,
            oidNumber: chequeData.chequeNumber, // Using chequeNumber as OID
            bankBranch: chequeData.bankBranch,
            submittedAt: chequeData.submittedAt,
            currentOffice: chequeData.currentOffice,
            recipient: chequeData.accountName,
            accountNumber: chequeData.accountNumber,
            type: chequeData.requestType === 'WITHDRAWAL' ? 'Withdrawal' : (chequeData.requestType === 'DEPOSIT' ? 'Cash Deposit' : 'Box Request')
        };
    }, [chequeData]);

    const handleCopy = () => {
        if (chequeResource) {
            navigator.clipboard.writeText(chequeResource.oidNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!chequeResource) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 gap-4">
            <Activity className="h-10 w-10 text-indigo-600 animate-pulse" />
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Retrieving Secure Intel...</p>
        </div>
    );

    const isWithdrawal = chequeResource.type === 'Withdrawal';
    const offices = ['Customer', 'Customer Service', 'Branch Controller', 'Teller', 'DONE'];
    const currentIdx = offices.indexOf(chequeResource.currentOffice) !== -1 ? offices.indexOf(chequeResource.currentOffice) : 2;

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
                                <h1 className="text-xl font-bold text-zinc-900 hidden sm:block">Cheque Review</h1>
                                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest text-[10px] font-bold">
                                    {chequeResource.status}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-zinc-500 mt-1">Ref: {chequeResource.id}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Main Actions & Stats */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Amount Hero Card */}
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 bg-white/5 h-80 w-80 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 bg-indigo-500/20 h-80 w-80 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div>
                                    {/* <p className="text-indigo-200 font-semibold mb-2 uppercase tracking-wider text-sm">Amount Under Review</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight whitespace-nowrap">
                                            {formatCurrency(chequeResource.amount)}
                                        </h2>
                                    </div> */}
                                    <div className="mt-8 flex items-center gap-3 sm:gap-6 flex-wrap">
                                        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                            <Activity className="h-4 w-4 text-emerald-400" />
                                            <span className="text-sm font-medium text-indigo-100">Live Audit Syncing</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium">
                                            <Calendar className="h-4 w-4 opacity-70" />
                                            {formatDate(chequeResource.submittedAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-4 sm:p-5 rounded-3xl backdrop-blur-md border border-white/20 w-full sm:w-auto min-w-[240px] shrink-0 mt-6 sm:mt-0 shadow-lg">
                                    <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-2.5">OID Number</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm sm:text-base font-mono font-medium tracking-widest bg-black/20 px-4 py-2.5 rounded-2xl flex-1 text-center truncate border border-white/5 shadow-inner">
                                            {chequeResource.oidNumber}
                                        </p>
                                        <button 
                                            onClick={handleCopy}
                                            className="h-[44px] w-[44px] shrink-0 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-2xl flex items-center justify-center transition-all border border-indigo-400/20 hover:scale-105"
                                            title="Copy OID Number"
                                        >
                                            {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-indigo-200" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-4 px-1">Custodian Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <StatCard icon={User} label="Initiating Entity" value={chequeResource.recipient} subValue={`Acc: ${chequeResource.accountNumber}`} />
                                <StatCard icon={FileText} label="Intended Action" value={chequeResource.type} subValue="Automated Classification" />
                            </div>
                        </div>

                        {/* Verification Path */}
                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-zinc-900 mb-4 px-1">Network Transit Path</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['Customer Service', 'Branch Controller', 'Teller', 'DONE'].map((step, i) => {
                                    const stepOrigIdx = offices.indexOf(step);
                                    const isPast = stepOrigIdx < currentIdx || chequeResource.status === 'PAID';
                                    const isCurrent = stepOrigIdx === currentIdx && chequeResource.status !== 'PAID';
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
                                                 <span className="text-[10px] font-bold">{i+1}</span>}
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
                                                    {isPast ? 'Cleared' : isCurrent ? 'Occupied' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Proof Verification */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Document Proof Section */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-200 shadow-sm text-center flex flex-col items-center group">
                            <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-50 group-hover:bg-indigo-50 border border-zinc-200 group-hover:border-indigo-100 flex items-center justify-center mb-4 transition-colors">
                                <ImageIcon className="h-6 w-6 text-zinc-500 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-zinc-900 mb-1">Instrument Proof</h4>
                            <p className="text-sm font-medium text-zinc-500 mb-6">Electronic Cheque Instrument</p>
                            
                            <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-200 mb-6 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                <div className="aspect-[4/3] bg-zinc-100 w-full relative">
                                    <img 
                                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt="Cheque Proof"
                                    />
                                    <div className="absolute inset-0 bg-zinc-900/0 opacity-0 group-hover:opacity-100 group-hover:bg-zinc-900/30 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <ArrowUpRight className="h-8 w-8 text-white drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-6 font-bold shadow-lg shadow-zinc-200"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Inspect Proof
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
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-zinc-900/80 backdrop-blur-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-zinc-50 rounded-[2rem] p-2 max-w-5xl w-full relative shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-900 shadow-sm border border-zinc-200 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Verified Instrument
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 z-10 h-11 w-11 bg-white/90 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-zinc-200 text-zinc-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="p-4 sm:p-10 flex min-h-[50vh] items-center justify-center bg-zinc-200/50 rounded-[1.5rem] border border-zinc-200/50">
                                <img 
                                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80" 
                                    className="w-full max-h-[75vh] object-contain shadow-2xl rounded-xl"
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
