'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, ArrowLeft, FileText, Landmark, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmitCheque() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/user/dashboard');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between px-2">
                            <Button variant="ghost" onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-900 font-black text-[10px]">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                Digital Submission
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card className="p-10 border-transparent shadow-premium ring-1 ring-zinc-50">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2 px-1">
                                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Account Information</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input label="Payee Name" placeholder="Full Name on Account" required />
                                                <Input label="Account No." placeholder="0000000000" required maxLength={10} />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2 px-1">
                                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Cheque Data</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input label="Leaf Serial No." placeholder="CHQ-000000" required />
                                                <Input label="Amount Required (₦)" type="number" placeholder="Enter amount..." required />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2 px-1">
                                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Contact & Branch</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input label="Registered Mobile" placeholder="+234..." required />
                                                <Input label="Pick-up Branch" placeholder="Lagos, Abuja, etc." required />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="w-full h-16 text-lg shadow-2xl shadow-indigo-100"
                                                isLoading={isLoading}
                                            >
                                                Initiate Transfer <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </div>

                            <aside className="space-y-6">
                                <Card className="p-8 bg-zinc-900 text-white border-none shadow-2xl shadow-zinc-200">
                                    <h4 className="text-lg font-black tracking-tight mb-6">Submission Policy</h4>
                                    <ul className="space-y-6">
                                        <li className="flex gap-4">
                                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <FileText className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">Ensure the leaf serial matches correctly</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <Landmark className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">Visit the branch for final leaf collection</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <Phone className="h-4 w-4 text-amber-400" />
                                            </div>
                                            <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">Keep your registered mobile accessible</p>
                                        </li>
                                    </ul>
                                </Card>
                            </aside>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            className="mb-10 p-10 bg-emerald-100 rounded-[3rem] shadow-2xl shadow-emerald-50"
                        >
                            <CheckCircle2 className="h-24 w-24 text-emerald-600" />
                        </motion.div>
                        <h2 className="text-5xl font-black text-zinc-900 mb-4 tracking-tighter">Request Received</h2>
                        <p className="text-zinc-500 mb-12 max-w-sm text-lg font-medium leading-relaxed">
                            Your submission is now being processed by our Customer Service desk.
                        </p>
                        <div className="flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-200">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                            Return Path Initiated
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
