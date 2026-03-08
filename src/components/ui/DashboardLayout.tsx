'use client';

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { UserRole } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: UserRole;
    userName: string;
}

export default function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const roleLabel: Record<UserRole, string> = {
        [UserRole.ADMIN]: "System Admin",
        [UserRole.USER]: "Account Holder",
        [UserRole.CUSTOMER_SERVICE]: "Customer Service",
        [UserRole.BRANCH_CONTROLLER]: "Branch Controller",
        [UserRole.TELLER]: "Authorizing Teller",
        [UserRole.TREASURY]: "Treasury Officer",
    };

    return (
        <div className="flex min-h-screen bg-mesh">
            <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Premium Header */}
                <header className="sticky top-0 z-40 glass border-b border-white/50 px-4 sm:px-6 lg:px-10 py-4">
                    <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
                        {/* Left: Hamburger (mobile) + Greeting */}
                        <div className="flex items-center gap-3">
                            {/* Hamburger — only on mobile */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="sidebar-hamburger h-9 w-9 rounded-xl bg-zinc-100/80 items-center justify-center text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shrink-0"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <div>
                                <h1 className="text-base font-black text-zinc-900 tracking-tight leading-none">
                                    Welcome back, <span className="text-gradient">{userName}</span>
                                </h1>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] mt-0.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                    {roleLabel[role] ?? role.replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search bar */}
                            <div className="hidden md:flex items-center gap-2 bg-zinc-100/80 rounded-xl px-4 py-2 focus-within:ring-2 ring-indigo-500/30 transition-all w-52 group">
                                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors shrink-0" />
                                <input
                                    placeholder="Search records..."
                                    className="bg-transparent text-[11px] font-medium text-zinc-600 placeholder:text-zinc-400 outline-none w-full"
                                />
                            </div>

                            {/* Notification Bell */}
                            <button className="relative h-10 w-10 rounded-xl bg-zinc-100/80 flex items-center justify-center text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                                <Bell className="h-4.5 w-4.5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                            </button>

                            {/* Avatar */}
                            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-zinc-900 leading-none">{userName}</p>
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">TrustBank Staff</p>
                                </div>
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-200 ring-2 ring-white transition-transform hover:scale-105">
                                        {userName.charAt(0)}
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 12, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.99 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
