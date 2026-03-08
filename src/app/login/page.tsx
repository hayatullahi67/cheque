'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email);
            if (user) {
                const rolePath = user.role.toLowerCase().replace(/_/g, '-');
                router.push(`/${rolePath}/dashboard`);
            } else {
                setError('Staff credentials not recognized. Please verify your email.');
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="h-20 w-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6 border-b-4 border-indigo-800 transition-transform hover:rotate-3">
                        <Building2 className="text-white h-10 w-10" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TrustBank</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Internal Workflow Terminal</p>
                </div>

                <Card className="bg-zinc-900/50 backdrop-blur-2xl border-white/5 p-10 ring-1 ring-white/10 shadow-2xl shadow-black/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-[42px] h-4 w-4 text-zinc-500 z-10" />
                                <Input
                                    label="Corporate Email"
                                    type="email"
                                    placeholder="yourname@bank.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white pl-11 h-14 focus:bg-white/10"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-[42px] h-4 w-4 text-zinc-500 z-10" />
                                <Input
                                    label="Access Key"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white pl-11 h-14 focus:bg-white/10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs font-bold text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-black bg-indigo-600 hover:bg-indigo-500 group"
                            isLoading={isLoading}
                        >
                            Log into Terminal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-loose">
                                Protected by Enterprise Grade Security<br />
                                and 256-bit encryption
                            </p>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
