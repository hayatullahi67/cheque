'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
    CheckCircle2, 
    ArrowRight, 
    ArrowLeft, 
    FileText, 
    Landmark, 
    Upload, 
    Scan, 
    Loader2, 
    Fingerprint,
    ShieldCheck,
    AlertCircle,
    X,
    Sparkles,
    Cpu,
    Zap,
    Package,
    BookOpen,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/helpers';

export default function SubmitCheque() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // States
    const [activeTab, setActiveTab] = useState<'submit' | 'box'>('submit');
    const [step, setStep] = useState<'form' | 'scanning' | 'details' | 'success'>('form');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        accountName: '',
        accountNumber: '',
        chequeNumber: '',
        amount: '',
        phoneNumber: '',
        branch: 'Lagos Main Branch'
    });

    const [boxRequest, setBoxRequest] = useState({
        bookType: 'Standard Savings',
        leafCount: '25 Leaves',
        deliveryMethod: 'Pickup',
        branch: 'Lagos Main Branch'
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAttachedImage(event.target?.result as string);
                startScanning();
            };
            reader.readAsDataURL(file);
        }
    };

    const startScanning = () => {
        setStep('scanning');
        
        setTimeout(() => {
            const mockExtractedData = {
                accountName: 'ADEWALE OLUWASEUN',
                accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                chequeNumber: `CHQ-${Math.floor(100000 + Math.random() * 900000)}`,
                amount: (Math.floor(Math.random() * 50) * 10000 + 50000).toString(),
                phoneNumber: '+234 812 345 6789',
                branch: 'Lagos Main Branch'
            };
            
            setFormData(mockExtractedData);
            setStep('details');
        }, 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setStep('success');
            setTimeout(() => {
                router.push('/user/dashboard');
            }, 3000);
        }, 2000);
    };

    const resetUpload = () => {
        setAttachedImage(null);
        setStep('form');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header section remains common */}
            <div className="flex items-center justify-between mb-12">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()} 
                    className="text-zinc-500 hover:text-zinc-900 font-bold text-xs bg-zinc-100/50 hover:bg-zinc-100 rounded-xl px-4 h-10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Exit Session
                </Button>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100/50">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Secure Node</span>
                </div>
            </div>

            {/* Premium Tab Switcher */}
            {step !== 'success' && step !== 'scanning' && (
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-zinc-100/50 p-1.5 rounded-2xl flex gap-1 border border-zinc-200/50">
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'submit' 
                                    ? "bg-white text-zinc-900 shadow-md ring-1 ring-zinc-200/20" 
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <Scan className="h-4 w-4" />
                            Digital Scan
                        </button>
                        <button
                            onClick={() => setActiveTab('box')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'box' 
                                    ? "bg-white text-zinc-900 shadow-md ring-1 ring-zinc-200/20" 
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <Package className="h-4 w-4" />
                            Request Box
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'form' && activeTab === 'submit' && (
                    <motion.div
                        key="submit-form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-10"
                    >
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Register New Cheque</h1>
                            <p className="text-zinc-500 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                                Upload a clear image of your cheque for automated data extraction.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto">
                            <Card 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-12 border-2 border-dashed border-zinc-200 bg-zinc-50/10 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer group"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                
                                <div className="h-20 w-20 bg-white rounded-3xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-500 mb-6">
                                    <Upload className="h-8 w-8" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-zinc-900 mb-1">Click to Upload</h3>
                                <p className="text-xs font-semibold text-zinc-400">or simply drag and drop here</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 px-4">
                            {[
                                { icon: Fingerprint, title: "Biometric Audit", text: "Identity verification active" },
                                { icon: Zap, title: "Neural Processing", text: "Instant data extraction" },
                                { icon: ShieldCheck, title: "Bank Grade", text: "Tier-1 security protocols" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center mb-4 text-zinc-900 font-bold">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-1">{item.title}</h4>
                                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'form' && activeTab === 'box' && (
                    <motion.div
                        key="box-form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-10"
                    >
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Request Cheque Box</h1>
                            <p className="text-zinc-500 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                                Order a physical cheque book delivered to your preferred location.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <Card className="p-10 border-none bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Account Type</label>
                                            <select 
                                                className="w-full px-4 h-12 rounded-xl bg-zinc-50 border-none ring-1 ring-zinc-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                value={boxRequest.bookType}
                                                onChange={(e) => setBoxRequest({...boxRequest, bookType: e.target.value})}
                                            >
                                                <option>Standard Savings</option>
                                                <option>Premium Corporate</option>
                                                <option>Individual Current</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Cheque Leaves</label>
                                            <select 
                                                className="w-full px-4 h-12 rounded-xl bg-zinc-50 border-none ring-1 ring-zinc-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                value={boxRequest.leafCount}
                                                onChange={(e) => setBoxRequest({...boxRequest, leafCount: e.target.value})}
                                            >
                                                <option>25 Leaves</option>
                                                <option>50 Leaves</option>
                                                <option>100 Leaves</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Collection Method</label>
                                            <select 
                                                className="w-full px-4 h-12 rounded-xl bg-zinc-50 border-none ring-1 ring-zinc-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                value={boxRequest.deliveryMethod}
                                                onChange={(e) => setBoxRequest({...boxRequest, deliveryMethod: e.target.value})}
                                            >
                                                <option value="Pickup">Pickup at Branch</option>
                                                <option value="Express">Express Delivery</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Preferred Branch</label>
                                            <Input 
                                                value={boxRequest.branch}
                                                onChange={(e) => setBoxRequest({...boxRequest, branch: e.target.value})}
                                                placeholder="Enter branch name"
                                                className="px-4 h-12 rounded-xl bg-zinc-50 border-zinc-100 text-sm font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {boxRequest.deliveryMethod === 'Express' && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pt-2">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Delivery Address</label>
                                                    <Input 
                                                        placeholder="Enter full residential or office address"
                                                        className="px-4 h-12 rounded-xl bg-zinc-50 border-zinc-100 text-sm font-semibold"
                                                        required
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 space-y-2">
                                         <div className="flex items-center gap-2">
                                             <Sparkles className="h-4 w-4 text-indigo-600" />
                                             <span className="text-[10px] font-bold text-indigo-950 uppercase tracking-widest">Notice</span>
                                         </div>
                                         <p className="text-[11px] text-indigo-600 font-medium leading-relaxed">
                                             A processing fee of ₦2,500 will be debited from your primary account upon authorization.
                                         </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-16 text-sm font-bold shadow-xl shadow-indigo-100 uppercase tracking-widest rounded-2xl group overflow-hidden relative"
                                        isLoading={isLoading}
                                    >
                                        <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                                        <span className="relative flex items-center justify-center gap-3">
                                            Confirm Request <ArrowRight className="h-5 w-5" />
                                        </span>
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {step === 'scanning' && (
                    <motion.div
                        key="scanning-step"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 min-h-[60vh]"
                    >
                        <div className="relative w-full max-w-lg aspect-[16/9] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-zinc-50 ring-1 ring-zinc-200/50">
                            {attachedImage && (
                                <img src={attachedImage} alt="Scanning" className="w-full h-full object-cover opacity-50 grayscale" />
                            )}
                            
                            <motion.div 
                                initial={{ top: '0%' }}
                                animate={{ top: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            />
                            
                            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                                <div className="px-6 py-4 rounded-2xl bg-white border border-zinc-100 shadow-xl flex items-center gap-4">
                                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                                    <span className="text-zinc-900 font-bold text-xs uppercase tracking-widest">Digitizing Document</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'details' && (
                    <motion.div
                        key="details-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4"
                    >
                        {/* Minimal Preview */}
                        <div className="lg:col-span-5">
                            <Card className="p-4 border-none shadow-xl shadow-zinc-200/50 rounded-[2.5rem] bg-white ring-1 ring-zinc-100">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source Image</span>
                                    <button 
                                        onClick={resetUpload}
                                        className="h-8 w-8 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-100 hover:text-red-600 transition-all focus:ring-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="relative aspect-[3/4] bg-zinc-50 rounded-2xl overflow-hidden shadow-inner border border-zinc-100">
                                    {attachedImage && (
                                        <img src={attachedImage} alt="Cheque" className="w-full h-full object-cover grayscale-[20%]" />
                                    )}
                                </div>
                                <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-950 uppercase">Verified Scan</p>
                                        <p className="text-[9px] text-indigo-600 font-semibold uppercase">Confidence: 98.4%</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Minimal Form */}
                        <div className="lg:col-span-7">
                            <Card className="p-10 border-none bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-4 w-1 bg-indigo-600 rounded-full" />
                                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Extracted Data</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                            {[
                                                { label: "Account Holder", name: "accountName", type: "text" },
                                                { label: "Account Number", name: "accountNumber", type: "text", max: 10 },
                                                { label: "Cheque Number", name: "chequeNumber", type: "text" },
                                                { label: "Amount (₦)", name: "amount", type: "number" },
                                                { label: "Phone Number", name: "phoneNumber", type: "text" },
                                                { label: "Bank Branch", name: "branch", type: "text" }
                                            ].map((field) => (
                                                <div key={field.name} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">{field.label}</label>
                                                    <Input 
                                                        value={formData[field.name as keyof typeof formData]} 
                                                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                                        required 
                                                        maxLength={field.max}
                                                        className="px-4 h-12 rounded-xl bg-zinc-50 border-zinc-100 text-sm font-semibold transition-all focus:bg-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-16 text-sm font-bold shadow-xl shadow-indigo-100 uppercase tracking-widest rounded-2xl group overflow-hidden relative"
                                        isLoading={isLoading}
                                    >
                                        <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                                        <span className="relative flex items-center justify-center gap-3">
                                            Confirm & Submit <ArrowRight className="h-5 w-5" />
                                        </span>
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success-step"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center min-h-[60vh]"
                    >
                        <div className="mb-10 p-12 bg-white rounded-[4rem] shadow-xl shadow-zinc-100 border border-zinc-50 flex items-center justify-center">
                            <div className="h-24 w-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm mx-auto">
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                                {activeTab === 'submit' ? 'Voucher Registered' : 'Request Broadcasted'}
                            </h2>
                            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                                {activeTab === 'submit' 
                                    ? "Your cheque submission has been successfully digitized and broadcasted to the verification node."
                                    : "Your cheque booklet request has been successfully queued for fulfillment and courier assignment."}
                            </p>
                        </div>

                        <div className="mt-12 inline-flex items-center gap-4 bg-zinc-900 text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Finalizing Transaction
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
