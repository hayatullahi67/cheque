'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { FilePlus, Bell, ArrowRight, Wallet, Zap, ShieldCheck, Cpu, AlertCircle, Fingerprint } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/helpers";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserDashboard() {
    const myCheques = mockCheques.filter(c => c.submittedBy === 'u2');
    const totalAmount = myCheques.reduce((acc, c) => acc + c.amount, 0);
    const activeCount = myCheques.filter(c => c.status !== 'PAID').length;

    return (
        <div className="space-y-8 py-4 px-2">
            {/* Top Workspace Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pipeline Value", value: formatCurrency(totalAmount), icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Active Requests", value: activeCount.toString(), icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Security Status", value: "Verified", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                    >
                        <Card className="p-6 border-none ring-1 ring-zinc-100/80 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                                    <h4 className="text-xl font-black text-zinc-900 tracking-tight">{stat.value}</h4>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Action Hub */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="relative overflow-hidden bg-zinc-900 border-none shadow-2xl group min-h-[320px] flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Cpu className="h-64 w-64 text-white" />
                        </div>
                        
                        <div className="relative z-10 p-10 flex flex-col h-full flex-grow">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">System Live: v4.2.0</span>
                            </div>
                            
                            <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
                                Secure Digital <br />
                                <span className="text-indigo-400">Vault Access</span>
                            </h2>
                            <p className="text-zinc-400 text-sm font-medium mb-12 max-w-sm leading-relaxed">
                                Accelerate your payment processing with our high-fidelity extraction engine. Submit any cheque image for instant digitization.
                            </p>
                            
                            <Link href="/user/submit-cheque" className="mt-auto w-fit">
                                <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 border-none shadow-xl shadow-white/5 px-10 rounded-2xl font-black text-xs uppercase tracking-widest h-14">
                                    Initiate Submission <ArrowRight className="ml-3 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="border-none ring-1 ring-zinc-100 shadow-sm overflow-hidden rounded-[2rem]">
                        <CardHeader
                            title="Recent Activity"
                            subtitle="Last 10 transactions in your workspace"
                            action={
                                <Link href="/user/history">
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-zinc-400">View Full History</Button>
                                </Link>
                            }
                        />
                        <div className="overflow-x-auto">
                            <Table>
                                <THead>
                                    <TR className="bg-zinc-50/50">
                                        <TH className="text-[10px] uppercase tracking-widest py-4">Reference</TH>
                                        <TH className="text-[10px] uppercase tracking-widest py-4">Amount</TH>
                                        <TH className="text-[10px] uppercase tracking-widest py-4 text-center">Live Status</TH>
                                        <TH className="text-[10px] uppercase tracking-widest py-4 text-right">Action</TH>
                                    </TR>
                                </THead>
                                <TBody>
                                    {myCheques.slice(0, 5).map((cheque) => (
                                        <TR key={cheque.id} className="hover:bg-zinc-50/80 transition-colors">
                                            <TD>
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-black text-zinc-900 text-sm tracking-tighter">{cheque.chequeNumber}</span>
                                                    <span className="text-[9px] text-zinc-400 font-bold uppercase mt-1">{formatDate(cheque.submittedAt)}</span>
                                                </div>
                                            </TD>
                                            <TD>
                                                <span className="font-black text-zinc-900">{formatCurrency(cheque.amount)}</span>
                                            </TD>
                                            <TD className="text-center">
                                                <Badge status={cheque.status} />
                                            </TD>
                                            <TD className="text-right">
                                                <Link href={`/user/cheques/${cheque.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TD>
                                        </TR>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 border-none ring-1 ring-zinc-100 shadow-sm bg-indigo-50/30">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Security Intel</h3>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    key={i} 
                                    className="flex gap-4 p-5 rounded-3xl bg-white border border-indigo-100/50 hover:border-indigo-200 shadow-sm transition-all"
                                >
                                    <div className="shrink-0 h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] text-zinc-600 font-bold leading-relaxed">
                                            Transfer <span className="text-zinc-900 font-black tracking-tight">#TR-00{i}</span> successfully authorized to external node.
                                        </p>
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase">2 hours ago</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <Button variant="ghost" className="w-full mt-8 text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all py-6">
                            Clear Audit Trail
                        </Button>
                    </Card>

                    <Card className="p-8 border-none ring-1 ring-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                            <Fingerprint className="h-32 w-32" />
                        </div>
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Identity verified</h4>
                        <h3 className="text-lg font-black text-zinc-900 tracking-tight mb-2">Biometric Protection</h3>
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6">
                            Your workspace is currently protected by Tier-1 biometric encryption. All activities are being recorded for your security.
                        </p>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="h-full bg-emerald-500" 
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
