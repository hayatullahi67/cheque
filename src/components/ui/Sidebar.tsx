'use client';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/helpers";
import { UserRole } from "@/lib/constants";
import {
    LayoutDashboard, Users, FileSearch, History, FileInput,
    CheckSquare, ShieldCheck, KeyRound, Banknote, LogOut, Building2, ChevronRight, Settings, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    role: UserRole;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ role, isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = {
        [UserRole.ADMIN]: [
            { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
            { icon: Users, label: "Employees", href: "/admin/users" },
            { icon: FileSearch, label: "Live Monitor", href: "/admin/cheques" },
            // System Controls removed per request
        ],
        [UserRole.USER]: [
            { icon: LayoutDashboard, label: "Home", href: "/user/dashboard" },
            { icon: FileInput, label: "New Request", href: "/user/submit-cheque" },
            { icon: History, label: "My History", href: "/user/history" },
        ],
        [UserRole.CUSTOMER_SERVICE]: [
            { icon: LayoutDashboard, label: "Workspace", href: "/customer-service/dashboard" },
        ],
        [UserRole.BRANCH_CONTROLLER]: [
            { icon: ShieldCheck, label: "Verification", href: "/branch-controller/dashboard" },
        ],
        [UserRole.TELLER]: [
            { icon: KeyRound, label: "Authorization", href: "/teller/dashboard" },
        ],
        [UserRole.TREASURY]: [
            { icon: Banknote, label: "Payment Desk", href: "/treasury/dashboard" },
        ],
    };

    const navItems = menuItems[role] ?? [];

    const SidebarContent = () => (
        <aside className="w-64 glass-dark flex flex-col min-h-screen shrink-0">
            {/* Logo */}
            <div className="flex items-center justify-between gap-3 px-6 py-7 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Building2 className="text-white h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-base tracking-tighter leading-none">TrustBank</h2>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Workflow PRO</p>
                    </div>
                </div>
                {/* Close button — only visible on mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-5 space-y-1">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] px-3 mb-3">Navigation</p>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href} onClick={onClose}>
                            <motion.div
                                whileHover={{ x: 3 }}
                                className={cn(
                                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-sidebar"
                                        className="absolute inset-0 rounded-xl bg-indigo-600"
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 transition-colors")} />
                                <span className="flex-1 leading-none">{item.label}</span>
                                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/50" />}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Footer */}
            <div className="px-3 pb-5 border-t border-white/5 pt-4 space-y-3">
                <button
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold group"
                >
                    <LogOut className="h-4.5 w-4.5 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* ── Desktop sidebar (always visible on lg+) ─────── */}
            <div className="sidebar-desktop">
                <SidebarContent />
            </div>

            {/* ── Mobile drawer (overlay, toggled by hamburger) ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        {/* Drawer */}
                        <motion.div
                            key="drawer"
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            className="fixed top-0 left-0 h-full z-50"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
