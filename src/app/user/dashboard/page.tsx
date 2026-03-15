'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { FilePlus, Bell, ArrowRight, Wallet, Zap, ShieldCheck, Cpu, AlertCircle, Fingerprint, Building2, Eye } from "lucide-react";
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
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 border-none ring-1 ring-zinc-100 shadow-sm bg-indigo-50/30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Verification Path</h3>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Clearing sequence</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { name: "Customer Service", desc: "Initial entry & screening" },
                                { name: "Branch Controller", desc: "Internal node authorization" },
                                { name: "Teller Unit", desc: "Final disbursement point" },
                                { name: "Settlement Node", desc: "Audit & record archival" }
                            ].map((office, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-indigo-100/50 hover:shadow-sm transition-all group">
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-zinc-900 font-black tracking-tight">{office.name}</p>
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{office.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Full-width Recent Activity Section - Replicating History Page Table Style */}
            <Card className="border-transparent shadow-premium overflow-hidden rounded-[2.5rem]">
                <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-zinc-100 bg-gradient-to-r from-white to-zinc-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-none">Recent Activity</h3>
                            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Latest workspace events</p>
                        </div>
                        <Link href="/user/history">
                            <div className="w-fit flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 uppercase tracking-widest hover:bg-indigo-100 transition-colors cursor-pointer">
                                VIEW FULL HISTORY <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <TR>
                                <TH>Request Ref</TH>
                                <TH>Operation Type</TH>
                                <TH>Process Date</TH>
                                <TH>Final Status</TH>
                                <TH className="text-right">Action</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {myCheques.slice(0, 10).map((cheque) => {
                                const opType = cheque.amount > 500000 ? 'Cash Deposit' : (cheque.amount < 100000 ? 'Box Request' : 'Withdrawal');
                                return (
                                    <TR key={cheque.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TD className="font-mono font-black text-zinc-400">{cheque.chequeNumber}</TD>
                                        <TD>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                <span className="font-bold text-zinc-900">{opType}</span>
                                            </div>
                                        </TD>
                                        <TD className="text-zinc-500 font-bold">{formatDate(cheque.submittedAt)}</TD>
                                        <TD><Badge status={cheque.status} /></TD>
                                        <TD className="text-right">
                                            <Link href={`/user/cheques/${cheque.id}`}>
                                                <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] transition-all whitespace-nowrap">
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </Button>
                                            </Link>
                                        </TD>
                                    </TR>
                                );
                            })}
                        </TBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
