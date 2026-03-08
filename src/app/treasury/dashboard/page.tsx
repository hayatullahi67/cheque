'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Banknote } from "lucide-react";
import { mockCheques } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/helpers";
import { ChequeStatus } from "@/lib/constants";

export default function TreasuryDashboard() {
    const router = useRouter();
    const relevantCheques = mockCheques.filter(c =>
        c.status === ChequeStatus.AUTHORIZED_BY_TELLER
    );

    return (
        <Card className="animate-in border-transparent shadow-soft">
            <CardHeader
                title="Payment Release Queue"
                subtitle="Final stage: Authorized cheques awaiting cash release"
            />
            <Table>
                <THead>
                    <TR>
                        <TH>Account Name</TH>
                        <TH>Cheque Ref</TH>
                        <TH>Amount</TH>
                        <TH>Status</TH>
                        <TH className="text-right">Action</TH>
                    </TR>
                </THead>
                <TBody>
                    {relevantCheques.map((cheque) => (
                        <TR key={cheque.id}>
                            <TD className="font-medium text-zinc-900">{cheque.accountName}</TD>
                            <TD className="font-mono text-zinc-500">{cheque.chequeNumber}</TD>
                            <TD className="font-bold text-emerald-700">{formatCurrency(cheque.amount)}</TD>
                            <TD><Badge status={cheque.status} /></TD>
                            <TD className="text-right">
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                                    size="sm"
                                    onClick={() => router.push(`/treasury/payment/${cheque.id}`)}
                                >
                                    <Banknote className="mr-2 h-4 w-4" /> Release Cash
                                </Button>
                            </TD>
                        </TR>
                    ))}
                </TBody>
            </Table>
            {relevantCheques.length === 0 && (
                <div className="py-24 text-center text-zinc-400 bg-zinc-50/20">
                    <p className="text-lg">No payments currently pending in the queue.</p>
                </div>
            )}
        </Card>
    );
}
