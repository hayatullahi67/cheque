'use client';

import { motion } from "framer-motion";
import {
    ShieldCheck, UserPlus, Settings2, RefreshCcw, AlertTriangle,
    Database, Lock, Bell, ArrowRight, Terminal, Wifi, HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.8, 0.25, 1] as const } } };

const controls = [
    {
        icon: UserPlus,
        title: "Onboard Staff",
        description: "Add new employees to the workflow system and assign office roles.",
        gradient: "from-indigo-500 to-violet-600",
        shadow: "shadow-indigo-200",
        cta: "Onboard Now",
        href: "/admin/users",
    },
    {
        icon: Lock,
        title: "Access Control",
        description: "Manage role-based permissions and revoke access for inactive staff.",
        gradient: "from-sky-500 to-blue-600",
        shadow: "shadow-sky-200",
        cta: "Manage Access",
        href: "#",
    },
    {
        icon: Bell,
        title: "Notifications",
        description: "Configure alert preferences, SMS notifications, and email triggers.",
        gradient: "from-amber-400 to-orange-500",
        shadow: "shadow-amber-200",
        cta: "Configure",
        href: "#",
    },
    {
        icon: Database,
        title: "Data Management",
        description: "Export records, run database cleanup, and manage cheque archives.",
        gradient: "from-emerald-400 to-teal-500",
        shadow: "shadow-emerald-200",
        cta: "Manage Data",
        href: "#",
    },
    {
        icon: RefreshCcw,
        title: "Workflow Reset",
        description: "Reset a stalled cheque workflow or manually advance a cheque stage.",
        gradient: "from-rose-400 to-pink-600",
        shadow: "shadow-rose-200",
        cta: "Manage Workflows",
        href: "/admin/cheques",
    },
    {
        icon: Settings2,
        title: "Global Configuration",
        description: "Adjust branch settings, processing limits, and system-wide parameters.",
        gradient: "from-zinc-600 to-zinc-800",
        shadow: "shadow-zinc-300",
        cta: "Open Settings",
        href: "#",
    },
];

const systemStatus = [
    { label: "API Server", status: "Online", icon: Wifi, ok: true },
    { label: "Database", status: "Online", icon: Database, ok: true },
    { label: "Storage", status: "95% Free", icon: HardDrive, ok: true },
    { label: "Workflow Engine", status: "Running", icon: Terminal, ok: true },
];

import { useState } from 'react';

// ... other imports ...

export default function SystemControlsPage() {
    const [isFlushing, setIsFlushing] = useState(false);

    return (
        <motion.div className="space-y-10" variants={container} initial="hidden" animate="show">

            {/* ── Hero ─────────────────────────────────────────── */}
            <motion.div variants={item}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-10 py-10 shadow-2xl">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-white/10 mb-5">
                                <ShieldCheck className="h-3 w-3" /> Admin Only
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">System Controls</h2>
                            <p className="text-zinc-400 text-sm font-medium max-w-lg leading-relaxed">
                                Direct workspace management — configure access, notifications, data, and global workflow parameters.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── System Status ─────────────────────────────── */}
            <motion.div variants={item}>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">System Status</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemStatus.map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center gap-3 shadow-sm">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${s.ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <s.icon className={`h-5 w-5 ${s.ok ? 'text-emerald-600' : 'text-red-500'}`} />
                            </div>
                            <div>
                                <p className="font-black text-zinc-900 text-sm leading-tight">{s.label}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${s.ok ? 'text-emerald-600' : 'text-red-500'}`}>{s.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Control Panels ────────────────────────────── */}
            <motion.div variants={item}>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Control Panels</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {controls.map((ctrl, i) => (
                        <motion.div
                            key={ctrl.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="group bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${ctrl.gradient} flex items-center justify-center shadow-lg ${ctrl.shadow} mb-5 group-hover:scale-110 transition-transform`}>
                                <ctrl.icon className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-black text-zinc-900 tracking-tight mb-1">{ctrl.title}</h4>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed flex-1">{ctrl.description}</p>
                            <Link href={ctrl.href} className="mt-5 block">
                                <Button variant="secondary" size="sm" className="w-full font-black text-[10px] group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                    {ctrl.cta} <ArrowRight className="ml-1.5 h-3 w-3 inline" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── Danger Zone ───────────────────────────────── */}
            <motion.div variants={item}>
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="font-black text-red-900 tracking-tight">Danger Zone</p>
                            <p className="text-red-500 text-xs font-medium mt-0.5">Irreversible system actions — proceed with caution.</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (isFlushing) return;
                            setIsFlushing(true);
                            setTimeout(() => {
                                setIsFlushing(false);
                            }, 2000);
                        }}
                        className={`font-black shadow-lg shrink-0 relative z-10 transition-all ${isFlushing
                            ? 'bg-red-400 cursor-not-allowed text-white shadow-none'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                            }`}
                    >
                        {isFlushing ? (
                            <span className="flex items-center gap-2">
                                <RefreshCcw className="h-4 w-4 animate-spin" /> Flushing Caches...
                            </span>
                        ) : (
                            "Flush All Caches"
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
