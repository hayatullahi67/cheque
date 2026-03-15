'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, FileText, Scan, Zap, AlertTriangle } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { ChequeStatus } from "@/lib/constants";

export default function BranchDashboard() {
    const router = useRouter();
    const relevantCheques = mockCheques.filter(c =>
        c.status === ChequeStatus.APPROVED_BY_CUSTOMER_SERVICE
    );

    return (
        <div className="space-y-10 animate-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-12 bg-[#09090B] text-white border-none shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12">
                        <Scan className="h-80 w-80" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-widest mb-10">
                                <AlertTriangle className="h-3 w-3" /> Security Clearance Required
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Physical Hub Validation</h2>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-loose max-w-sm mb-12">
                                Verify physical security features and digital leaf signatures in real-time.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Station</span>
                                <span className="text-white font-black text-lg">OFFICE-02-B1</span>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol</span>
                                <span className="text-emerald-500 font-black text-lg">ENCRYPTED</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-8 border-transparent shadow-premium bg-white flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Queue Flow</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Incoming Traffic</p>
                                    <p className="text-2xl font-black text-indigo-600 leading-none">Medium</p>
                                </div>
                                <div className="grid grid-cols-12 gap-1 px-1">
                                    {[2, 4, 3, 6, 8, 5, 2, 7, 9, 4, 3, 5].map((h, i) => (
                                        <div key={i} className={`col-span-1 rounded-full bg-indigo-100 transition-all duration-700`} style={{ height: `${h * 4}px`, backgroundColor: i > 8 ? 'rgb(99 102 241)' : '' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pt-6 border-t border-zinc-50 text-center">
                            Awaiting physical leaf arrival
                        </p>
                    </Card>
                </div>
            </div>

            <Card className="border-transparent shadow-premium overflow-hidden mt-10">
                <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-zinc-100 bg-gradient-to-r from-white to-zinc-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-none">Security Clearance Queue</h3>
                            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Awaiting physical leaf authentication</p>
                        </div>
                        <div className="w-fit flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 uppercase tracking-widest">
                            <ShieldCheck className="h-3.5 w-3.5" /> {relevantCheques.length} Active Requests
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <TR>
                                <TH>Request Ref</TH>
                                <TH>Beneficiary</TH>
                                <TH>Operation Type</TH>
                                <TH>Assigned Date</TH>
                                <TH>Status</TH>
                                <TH className="text-right">Security Protocol</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {relevantCheques.map((cheque) => {
                                const opType = cheque.requestType === 'WITHDRAWAL' ? 'Withdrawal' : (cheque.requestType === 'DEPOSIT' ? 'Cash Deposit' : 'Box Request');
                                return (
                                    <TR key={cheque.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TD className="font-mono font-black text-zinc-400">{cheque.chequeNumber}</TD>
                                        <TD className="font-bold text-zinc-900">{cheque.accountName}</TD>
                                        <TD>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                <span className="font-bold text-zinc-900">{opType}</span>
                                            </div>
                                        </TD>
                                        <TD className="text-zinc-500 font-bold">{formatDate(cheque.submittedAt)}</TD>
                                        <TD><Badge status={cheque.status} /></TD>
                                        <TD className="text-right">
                                            <Button
                                                className="h-9 px-4 bg-zinc-900 text-white hover:bg-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                                                size="sm"
                                                onClick={() => router.push(`/branch-controller/verify/${cheque.id}`)}
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" /> Start Verify
                                            </Button>
                                        </TD>
                                    </TR>
                                );
                            })}
                        </TBody>
                    </Table>
                </div>

                {relevantCheques.length === 0 && (
                    <div className="py-32 text-center bg-zinc-50/30">
                        <div className="h-20 w-20 bg-zinc-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-zinc-300 shadow-inner">
                            <FileText className="h-10 w-10" />
                        </div>
                        <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">No pending verifications found</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
