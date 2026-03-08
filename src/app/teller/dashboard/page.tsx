'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KeyRound, ShieldCheck, Zap, Layers, Lock } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/helpers";
import { ChequeStatus } from "@/lib/constants";

export default function TellerDashboard() {
    const router = useRouter();
    const relevantCheques = mockCheques.filter(c =>
        c.status === ChequeStatus.FORWARDED_TO_TELLER
    );

    return (
        <div className="space-y-10 animate-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-10 bg-[#09090B] text-white border-none shadow-2xl shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Lock className="h-64 w-64 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <KeyRound className="text-white h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Authorization Portal</h2>
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
                            Digital Vault Ready<br />for Final Sign-off
                        </h3>
                        <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-sm uppercase tracking-widest mb-10">
                            Perform final biometric-authenticated signatures on verified leaves to release liquidity.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Secure Protocol v2.4</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">High Priority Mode</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-transparent shadow-premium bg-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-zinc-400">
                            <Layers className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Queue Density</span>
                        </div>
                        <div className="flex items-end gap-3 mb-2">
                            <h4 className="text-5xl font-black text-zinc-900 tracking-tighter">{relevantCheques.length}</h4>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Folders Pending</p>
                        </div>
                        <div className="w-full bg-zinc-50 h-2 rounded-full overflow-hidden mt-6">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(relevantCheques.length / 10) * 100}%` }} />
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full text-indigo-600 font-black text-[10px] hover:bg-zinc-50">
                        REFRESH QUEUE
                    </Button>
                </Card>
            </div>

            <Card className="border-transparent shadow-premium overflow-hidden">
                <CardHeader
                    title="Authorized Signing Queue"
                    subtitle="Final stage review for cheques verified by controllers"
                />
                <Table>
                    <THead>
                        <TR>
                            <TH>Account Name</TH>
                            <TH>Cheque Reference</TH>
                            <TH>Amount</TH>
                            <TH>Office Logs</TH>
                            <TH className="text-right">Digital Sign</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {relevantCheques.map((cheque) => (
                            <TR key={cheque.id}>
                                <TD className="font-bold text-zinc-900">{cheque.accountName}</TD>
                                <TD className="font-mono font-black text-zinc-400">{cheque.chequeNumber}</TD>
                                <TD className="font-black text-indigo-700 text-lg">{formatCurrency(cheque.amount)}</TD>
                                <TD><Badge status={cheque.status} /></TD>
                                <TD className="text-right">
                                    <Button
                                        className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black"
                                        size="sm"
                                        onClick={() => router.push(`/teller/authorize/${cheque.id}`)}
                                    >
                                        <KeyRound className="mr-2 h-3.5 w-3.5" /> AUTHORIZE
                                    </Button>
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {relevantCheques.length === 0 && (
                    <div className="py-24 text-center bg-zinc-50/20 grayscale">
                        <Lock className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">No cheques currently awaiting authorization.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
