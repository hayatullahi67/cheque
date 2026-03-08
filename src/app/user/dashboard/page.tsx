'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { FilePlus, Bell, ArrowRight, Wallet } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserDashboard() {
    const myCheques = mockCheques.filter(c => c.submittedBy === 'u2');

    return (
        <div className="space-y-10 animate-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 relative overflow-hidden bg-indigo-600 border-none shadow-2xl shadow-indigo-200 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors" />
                    <div className="relative z-10 p-10 flex flex-col h-full">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-8 border border-white/20">
                            <Wallet className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
                            Fast Track Your<br />Cheque Payments
                        </h2>
                        <p className="text-indigo-100 text-lg font-medium mb-10 max-w-md leading-relaxed opacity-90">
                            Skip the branch queues. Submit your details digitally and track your funds in real-time.
                        </p>
                        <Link href="/user/submit-cheque" className="mt-auto">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-zinc-50 border-none shadow-xl shadow-indigo-900/20 px-10">
                                New Submission <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card className="p-8 border-transparent shadow-premium flex flex-col divide-y divide-zinc-50">
                    <div className="pb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                <Bell className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Updates</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-indigo-100 transition-colors group">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-indigo-600 group-hover:scale-125 transition-transform" />
                                    <p className="text-xs text-zinc-600 font-bold leading-relaxed">
                                        Your request <span className="text-zinc-900">CHQ-00010{i}</span> has moved to <span className="text-indigo-600">Verification</span> stage.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-6 mt-auto">
                        <Button variant="ghost" className="w-full text-zinc-400 font-black text-[10px] hover:bg-zinc-50">
                            View All Notifications
                        </Button>
                    </div>
                </Card>
            </div>

            <Card>
                <CardHeader
                    title="Active Workspace"
                    subtitle="Tracking your current submitted cheques"
                    action={
                        <Link href="/user/history">
                            <Button variant="secondary" size="sm">History</Button>
                        </Link>
                    }
                />
                <Table>
                    <THead>
                        <TR>
                            <TH>Cheque Ref</TH>
                            <TH>Amount</TH>
                            <TH>Submitted On</TH>
                            <TH>Live Status</TH>
                            <TH className="text-right">Actions</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {myCheques.map((cheque) => (
                            <TR key={cheque.id}>
                                <TD className="font-mono font-black text-zinc-500">{cheque.chequeNumber}</TD>
                                <TD className="font-black text-zinc-900 text-lg">{formatCurrency(cheque.amount)}</TD>
                                <TD className="text-zinc-500 font-bold">{formatDate(cheque.submittedAt)}</TD>
                                <TD><Badge status={cheque.status} /></TD>
                                <TD className="text-right">
                                    <Button variant="ghost" size="sm" className="font-black text-[10px] text-indigo-600">Track</Button>
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
            </Card>
        </div>
    );
}
