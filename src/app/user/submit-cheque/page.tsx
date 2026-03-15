'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
    CheckCircle2, ArrowRight, ArrowLeft, Upload, 
    ShieldCheck, Plus, Trash2, Building, ScanLine, Wallet, Package, ArrowDownToLine, ArrowUpFromLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/helpers';

type RequestType = 'withdrawal' | 'deposit' | 'box' | null;

export default function SubmitRequest() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Core States
    const [requestType, setRequestType] = useState<RequestType>(null);
    const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [oidNumber, setOidNumber] = useState('');
    
    // Deposit States
    const [totalBoxes, setTotalBoxes] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [denominations, setDenominations] = useState([{ id: 1, denomination: '', pieces: '', amount: 0 }]);
    
    // Box States
    const [boxAction, setBoxAction] = useState<'request' | 'return' | null>(null);
    const [numberOfBoxes, setNumberOfBoxes] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAttachedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addDenomination = () => {
        setDenominations([...denominations, { id: Date.now(), denomination: '', pieces: '', amount: 0 }]);
    };

    const removeDenomination = (id: number) => {
        if (denominations.length > 1) {
            setDenominations(denominations.filter(d => d.id !== id));
        }
    };

    const updateDenomination = (id: number, field: string, value: string) => {
        setDenominations(denominations.map(d => {
            if (d.id === id) {
                const updated = { ...d, [field]: value };
                if (field === 'denomination' || field === 'pieces') {
                    const denomValue = parseFloat(updated.denomination) || 0;
                    const piecesValue = parseFloat(updated.pieces) || 0;
                    updated.amount = denomValue * piecesValue;
                }
                return updated;
            }
            return d;
        }));
    };

    const totalCalculatedAmount = useMemo(() => {
        return denominations.reduce((sum, d) => sum + d.amount, 0);
    }, [denominations]);

    const isValidDeposit = totalCalculatedAmount === (parseFloat(totalAmount) || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (requestType === 'deposit' && !isValidDeposit) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('success');
            setTimeout(() => {
                router.push('/user/dashboard'); // Or history
            }, 3000);
        }, 2000);
    };

    const resetFlow = () => {
        setRequestType(null);
        setStep('selection');
        setAttachedImage(null);
        setTotalBoxes('');
        setTotalAmount('');
        setDenominations([{ id: 1, denomination: '', pieces: '', amount: 0 }]);
        setBoxAction(null);
        setNumberOfBoxes('');
        setOidNumber('');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
            {/* DMB Header */}
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <Button 
                    variant="ghost" 
                    onClick={() => step === 'selection' ? router.back() : resetFlow()} 
                    className="text-zinc-500 hover:text-zinc-900 font-bold text-[10px] sm:text-xs bg-zinc-100/50 hover:bg-zinc-100 rounded-xl px-3 sm:px-4 h-9 sm:h-10 transition-all active:scale-95"
                >
                    <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
                    <span className="hidden xs:inline">{step === 'selection' ? 'Exit Session' : 'Back to Selection'}</span>
                    <span className="xs:hidden">Back</span>
                </Button>
                
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50/50 backdrop-blur-sm rounded-full border border-indigo-100/30 shadow-sm">
                    <Building className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-indigo-500" />
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-700 uppercase tracking-widest leading-none">DMB Operations</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'selection' && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-8 sm:space-y-12"
                    >
                        <div className="text-center space-y-3 sm:space-y-4 px-2">
                            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-[1.1]">New DMB Request</h1>
                            <p className="text-zinc-500 font-medium text-xs sm:text-sm max-w-[320px] sm:max-w-md mx-auto leading-relaxed">
                                Select the type of operation you want to perform for your commercial banking node.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {/* Withdrawal Card */}
                            <Card 
                                onClick={() => { setRequestType('withdrawal'); setStep('form'); }}
                                className="group p-8 border-2 border-transparent bg-white hover:border-indigo-500 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] cursor-pointer transition-all duration-500 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <ScanLine className="h-24 w-24" />
                                </div>
                                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                                    <Wallet className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 mb-2">Withdrawal</h3>
                                    <p className="text-xs text-zinc-500 font-medium">Process cheque withdrawal with OID reference.</p>
                                </div>
                            </Card>

                            {/* Deposit Card */}
                            <Card 
                                onClick={() => { setRequestType('deposit'); setStep('form'); }}
                                className="group p-8 border-2 border-transparent bg-white hover:border-indigo-500 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] cursor-pointer transition-all duration-500 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <ArrowDownToLine className="h-24 w-24" />
                                </div>
                                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                                    <Building className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 mb-2">Cash Deposit</h3>
                                    <p className="text-xs text-zinc-500 font-medium">Log incoming cash boxes by denominations.</p>
                                </div>
                            </Card>

                            {/* Box Control Card */}
                            <Card 
                                onClick={() => { setRequestType('box'); setStep('form'); }}
                                className="group p-8 border-2 border-transparent bg-white hover:border-indigo-500 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] cursor-pointer transition-all duration-500 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <Package className="h-24 w-24" />
                                </div>
                                <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                                    <Package className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 mb-2">Box Management</h3>
                                    <p className="text-xs text-zinc-500 font-medium">Request new cash boxes or return empty ones.</p>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="p-8 sm:p-12 border-none bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/40 ring-1 ring-zinc-100">
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                    requestType === 'withdrawal' ? 'bg-indigo-600 shadow-indigo-200' :
                                    requestType === 'deposit' ? 'bg-emerald-600 shadow-emerald-200' :
                                    'bg-amber-600 shadow-amber-200'
                                )}>
                                    {requestType === 'withdrawal' && <Wallet className="h-6 w-6" />}
                                    {requestType === 'deposit' && <ArrowDownToLine className="h-6 w-6" />}
                                    {requestType === 'box' && <Package className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight capitalize">{requestType} Request</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">DMB Operator Form</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* WITHDRAWAL FORM */}
                                {requestType === 'withdrawal' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">OID Number</label>
                                            <Input 
                                                value={oidNumber}
                                                onChange={(e) => setOidNumber(e.target.value)}
                                                placeholder="Enter unique OID reference"
                                                className="px-4 h-14 rounded-xl bg-zinc-50 border-zinc-100 text-sm font-semibold transition-all focus:bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Cheque Image</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-32 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-white transition-all group overflow-hidden relative"
                                            >
                                                {attachedImage ? (
                                                    <img src={attachedImage} alt="Cheque" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                ) : (
                                                    <>
                                                        <Upload className="h-6 w-6 text-zinc-400 group-hover:text-indigo-600 mb-2 transition-colors" />
                                                        <span className="text-xs font-bold text-zinc-500">Tap to upload cheque</span>
                                                    </>
                                                )}
                                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* DEPOSIT FORM */}
                                {requestType === 'deposit' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Total Boxes</label>
                                                <Input 
                                                    type="number"
                                                    value={totalBoxes}
                                                    onChange={(e) => setTotalBoxes(e.target.value)}
                                                    placeholder="e.g. 5"
                                                    className="px-4 h-14 rounded-xl bg-zinc-50 border-zinc-100 font-semibold"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Total Amount (₦)</label>
                                                <Input 
                                                    type="number"
                                                    value={totalAmount}
                                                    onChange={(e) => setTotalAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="px-4 h-14 rounded-xl bg-zinc-50 border-zinc-100 font-black text-indigo-900"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 pb-2">
                                            <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2 mb-4 flex items-center gap-2">
                                                Denomination Breakdown
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                {denominations.map((d, i) => (
                                                    <div key={d.id} className="flex gap-2 items-start">
                                                        <div className="flex-1 space-y-1">
                                                            <Input 
                                                                type="number" placeholder="Denom (e.g. 1000)" 
                                                                className="h-10 text-xs px-3"
                                                                value={d.denomination} onChange={(e) => updateDenomination(d.id, 'denomination', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <Input 
                                                                type="number" placeholder="Pieces" 
                                                                className="h-10 text-xs px-3"
                                                                value={d.pieces} onChange={(e) => updateDenomination(d.id, 'pieces', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <Input 
                                                                type="text" value={`₦ ${d.amount.toLocaleString()}`} 
                                                                className="h-10 text-xs px-3 bg-zinc-100 border-none font-bold text-zinc-600 cursor-not-allowed"
                                                                readOnly
                                                            />
                                                        </div>
                                                        <Button 
                                                            type="button" variant="ghost" 
                                                            onClick={() => removeDenomination(d.id)}
                                                            className="h-10 w-10 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <Button type="button" variant="ghost" onClick={addDenomination} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                                                <Plus className="h-4 w-4 mr-1" /> Add Denomination
                                            </Button>
                                        </div>

                                        {/* Validation Panel */}
                                        <div className={cn(
                                            "p-4 rounded-xl border flex items-center justify-between",
                                            isValidDeposit ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                                        )}>
                                            <div>
                                                <p className={cn("text-[9px] font-bold uppercase tracking-widest", isValidDeposit ? "text-emerald-700" : "text-amber-700")}>
                                                    Calculated Total
                                                </p>
                                                <p className={cn("text-lg font-black tracking-tight", isValidDeposit ? "text-emerald-900" : "text-amber-900")}>
                                                    ₦ {totalCalculatedAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            {isValidDeposit ? (
                                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                            ) : (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-amber-600 uppercase">Mismatch</p>
                                                    <p className="text-xs font-bold text-amber-800">Must equal ₦{parseFloat(totalAmount || '0').toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* BOX FORM */}
                                {requestType === 'box' && (
                                    <div className="space-y-6">
                                        
                                        <div className="flex bg-zinc-100/50 p-1.5 rounded-2xl gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setBoxAction('request')}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    boxAction === 'request' ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:bg-zinc-100"
                                                )}
                                            >
                                                Request Empty Boxes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBoxAction('return')}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    boxAction === 'return' ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:bg-zinc-100"
                                                )}
                                            >
                                                Return Boxes
                                            </button>
                                        </div>

                                        {boxAction && (
                                            <AnimatePresence>
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Number of Boxes</label>
                                                        <Input 
                                                            type="number"
                                                            value={numberOfBoxes}
                                                            onChange={(e) => setNumberOfBoxes(e.target.value)}
                                                            placeholder="e.g. 10"
                                                            className="px-4 h-14 rounded-xl bg-zinc-50 border-zinc-100 font-semibold"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Attach Proof (Optional)</label>
                                                        <div 
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="h-24 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-white transition-all group overflow-hidden relative"
                                                        >
                                                            {attachedImage ? (
                                                                <img src={attachedImage} alt="Proof" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                            ) : (
                                                                <Upload className="h-5 w-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                                                            )}
                                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={requestType === 'deposit' && !isValidDeposit}
                                    className={cn(
                                        "w-full h-16 text-sm font-bold shadow-xl uppercase tracking-widest rounded-2xl group overflow-hidden relative transition-all",
                                        (requestType === 'deposit' && !isValidDeposit) 
                                            ? "opacity-50 cursor-not-allowed bg-zinc-300 shadow-none text-zinc-500" 
                                            : "shadow-indigo-100"
                                    )}
                                    isLoading={isLoading}
                                >
                                    {!(requestType === 'deposit' && !isValidDeposit) && <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />}
                                    <span className="relative flex items-center justify-center gap-3">
                                        Authorize Request 
                                        {!(requestType === 'deposit' && !isValidDeposit) && <ArrowRight className="h-5 w-5" />}
                                    </span>
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success-step"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh]"
                    >
                        <div className="mb-10 p-12 bg-white rounded-[4rem] shadow-xl shadow-zinc-100 border border-zinc-50 flex items-center justify-center">
                            <div className="h-24 w-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto">
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                                Transmission Successful
                            </h2>
                            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                                Your DMB {requestType} request has been securely encoded and transmitted to the central processing node.
                            </p>
                        </div>

                        <div className="mt-12 inline-flex items-center gap-4 bg-zinc-900 text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Clearing Vault Interface
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
