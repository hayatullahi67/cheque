'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { History, FileText, Download, ArrowLeft, Search, Eye, CheckCircle2, Activity } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function UserHistory() {
    const router = useRouter();
    const myCheques = mockCheques.filter(c => c.submittedBy === 'u2');

    return (
        <div className="space-y-6 sm:space-y-10 animate-in pb-12">
            {/* Nav & Action Heading - Responsive Stacking */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="w-fit text-zinc-400 hover:text-zinc-900 font-black text-[10px] p-0 h-auto"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
                </Button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input placeholder="Search records..." className="pl-12 h-11 bg-white border-zinc-100 shadow-sm rounded-xl" />
                    </div>
                    <Button variant="secondary" className="h-11 font-black shadow-sm rounded-xl text-[10px] uppercase tracking-widest whitespace-nowrap">
                        <Download className="mr-2 h-4 w-4" /> Export ALL
                    </Button>
                </div>
            </div>

            {/* Redesigned Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Volume", value: myCheques.length, sub: "Requests processed", icon: History, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Settled", value: formatCurrency(myCheques.filter(c => c.status === 'PAID').reduce((t, c) => t + c.amount, 0)), sub: "Successfully paid", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Pending Value", value: formatCurrency(myCheques.filter(c => c.status !== 'PAID').reduce((t, c) => t + c.amount, 0)), sub: "Awaiting release", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                        <div className={cn("h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl font-black text-zinc-900 tracking-tight">{stat.value}</p>
                            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1 opacity-70">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Card className="border-transparent shadow-premium overflow-hidden">
                {/* Custom Responsive Header Section (Avoiding CardHeader component for more mobile control) */}
                <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-zinc-100 bg-gradient-to-r from-white to-zinc-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-none">Transaction Archives</h3>
                            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Historical digital vault</p>
                        </div>
                        <div className="w-fit flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">
                            <History className="h-3.5 w-3.5" /> {myCheques.length} Records found
                        </div>
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
                                <TH className="text-right">Documents</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {myCheques.map((cheque) => {
                                const opType = cheque.requestType === 'WITHDRAWAL' ? 'Withdrawal' : (cheque.requestType === 'DEPOSIT' ? 'Cash Deposit' : 'Box Request');
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
                                        <TD className="text-right flex items-center justify-end gap-2">
                                            <Link href={`/user/cheques/${cheque.id}`}>
                                                <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] transition-all">
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="h-9 px-3 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 font-black text-[10px] transition-all">
                                                <FileText className="mr-2 h-4 w-4" /> Receipt
                                            </Button>
                                        </TD>
                                    </TR>
                                );
                            })}
                        </TBody>
                    </Table>
                </div>

                {myCheques.length === 0 && (
                    <div className="py-32 text-center bg-zinc-50/30">
                        <div className="h-20 w-20 bg-zinc-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-zinc-300 shadow-inner">
                            <History className="h-10 w-10" />
                        </div>
                        <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">No transaction history found</p>
                    </div>
                )}
            </Card>


        </div>
    );
}
