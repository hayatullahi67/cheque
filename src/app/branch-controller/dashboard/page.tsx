'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, FileText, Scan, Zap, AlertTriangle } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/helpers";
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

            <Card className="border-transparent shadow-premium overflow-hidden">
                <CardHeader
                    title="Physical Verification Queue"
                    subtitle="Branch Controller workload: Validating physical characteristics of submitted leaves"
                />
                <Table>
                    <THead>
                        <TR>
                            <TH>Beneficiary</TH>
                            <TH>Cheque Ref</TH>
                            <TH>Amount</TH>
                            <TH>Verify Window</TH>
                            <TH className="text-right">Action</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {relevantCheques.map((cheque) => (
                            <TR key={cheque.id}>
                                <TD className="font-bold text-zinc-900">{cheque.accountName}</TD>
                                <TD className="font-mono font-black text-zinc-400">{cheque.chequeNumber}</TD>
                                <TD className="font-black text-zinc-900 text-lg">{formatCurrency(cheque.amount)}</TD>
                                <TD>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-100">30 MINS</span>
                                    </div>
                                </TD>
                                <TD className="text-right">
                                    <Button
                                        className="h-9 px-5 bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black"
                                        size="sm"
                                        onClick={() => router.push(`/branch-controller/verify/${cheque.id}`)}
                                    >
                                        <ShieldCheck className="mr-2 h-3.5 w-3.5" /> START VERIFY
                                    </Button>
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {relevantCheques.length === 0 && (
                    <div className="py-24 text-center bg-zinc-50/20">
                        <FileText className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">No pending verifications at this terminal.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
