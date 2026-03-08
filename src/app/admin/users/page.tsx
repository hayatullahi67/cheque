'use client';

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Mail, Building2, BadgeCheck, Users, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, THead, TBody, TH, TR, TD } from "@/components/ui/Table";
import { mockUsers } from "@/lib/mock-data";
import { UserRole } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";


// Colour palette per office
const OFFICE_STYLES: Record<string, { gradient: string; shadow: string; badge: string; badgeText: string }> = {
    "Customer Service": { gradient: "from-indigo-500 to-violet-600", shadow: "shadow-indigo-200", badge: "bg-indigo-50 text-indigo-700 border-indigo-100", badgeText: "text-indigo-600" },
    "Branch Controller": { gradient: "from-sky-500 to-blue-600", shadow: "shadow-sky-200", badge: "bg-sky-50 text-sky-700 border-sky-100", badgeText: "text-sky-600" },
    "Teller": { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-200", badge: "bg-amber-50 text-amber-700 border-amber-100", badgeText: "text-amber-600" },
    "Treasury": { gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", badgeText: "text-emerald-600" },
    "Corporate": { gradient: "from-zinc-700 to-zinc-900", shadow: "shadow-zinc-200", badge: "bg-zinc-100 text-zinc-700 border-zinc-200", badgeText: "text-zinc-600" },
};

const ROLE_LABEL: Record<string, string> = {
    [UserRole.ADMIN]: "System Admin",
    [UserRole.CUSTOMER_SERVICE]: "Customer Service",
    [UserRole.BRANCH_CONTROLLER]: "Branch Controller",
    [UserRole.TELLER]: "Authorizing Teller",
    [UserRole.TREASURY]: "Treasury Officer",
    [UserRole.USER]: "Account Holder",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] as const } } };

export default function EmployeesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [formName, setFormName] = useState("");
    const [isStaff, setIsStaff] = useState(false);
    const [formRole, setFormRole] = useState<string>(UserRole.USER);

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        // reset form
        setFormName("");
        setIsStaff(false);
        setFormRole(UserRole.USER);
    };

    const submitForm = () => {
        // frontend-only: just log and close
        console.log("registering", { name: formName, isStaff, role: isStaff ? formRole : UserRole.USER });
        closeModal();
    };


    // Memoize staff and customers to avoid recalculation
    const [allStaff, setAllStaff] = useState<typeof mockUsers>([]);
    const [allCustomers, setAllCustomers] = useState<typeof mockUsers>([]);

    useEffect(() => {
        setAllStaff(mockUsers.filter(u => u.employeeId));
        setAllCustomers(mockUsers.filter(u => u.role === UserRole.USER));
    }, []);

    // Filter logic
    const filteredStaff = useMemo(() => {
        return allStaff.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = filterRole === "ALL" || user.role === filterRole;

            return matchesSearch && matchesRole;
        });
    }, [allStaff, searchTerm, filterRole]);

    const filteredCustomers = useMemo(() => {
        return allCustomers.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            // Customers bypass role and office filter
            return matchesSearch;
        });
    }, [allCustomers, searchTerm]);

    const uniqueRolesForStaff = useMemo(() => {
        const roles = new Set(allStaff.map(u => u.role));
        return ["ALL", ...Array.from(roles)];
    }, [allStaff]);

    return (
        <>
            <Modal isOpen={showModal} onClose={closeModal} title="Register new user">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Name</label>
                        <Input
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Full name"
                            className="mt-1"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="userType"
                                checked={!isStaff}
                                onChange={() => setIsStaff(false)}
                                className="form-radio"
                            />
                            <span className="ml-2 text-sm">Account Holder</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="userType"
                                checked={isStaff}
                                onChange={() => setIsStaff(true)}
                                className="form-radio"
                            />
                            <span className="ml-2 text-sm">Staff</span>
                        </label>
                    </div>
                    {isStaff && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700">Role</label>
                            <select
                                value={formRole}
                                onChange={(e) => setFormRole(e.target.value)}
                                className="mt-1 block w-full rounded-xl border-zinc-200 bg-zinc-50 text-sm p-2"
                            >
                                {Object.values(UserRole)
                                    .filter(r => r !== UserRole.USER)
                                    .map(r => (
                                        <option key={r} value={r}>
                                            {ROLE_LABEL[r] ?? r}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end pt-4">
                        <Button variant="secondary" onClick={closeModal} className="mr-2">
                            Cancel
                        </Button>
                        <Button onClick={submitForm} disabled={!formName.trim()}>
                            {isStaff ? "Register Staff" : "Register User"}
                        </Button>
                    </div>
                </div>
            </Modal>
            <motion.div className="space-y-10" variants={container} initial="hidden" animate="show">

                {/* ── Header ─────────────────────────────────────── */}
                <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tighter mb-2">Staff Directory</h2>
                        <p className="text-zinc-500 font-medium text-sm">
                            Manage {allStaff.length} employees.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={openModal} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 font-bold rounded-xl">
                            <UserPlus className="mr-2 h-4 w-4" /> Onboard
                        </Button>
                    </div>
                </motion.div>


                {/* ── Search & Filter Bar ─────────────────────────── */}
                <motion.div variants={item}>
                    <Card className="p-4 border-transparent shadow-premium flex flex-col md:flex-row gap-4 items-center justify-between overflow-visible">
                        <div className="relative w-full md:w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search staff ID, name, or email..."
                                className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-indigo-500 font-medium placeholder:text-zinc-400 w-full rounded-xl"
                            />
                        </div>
                        <div className="flex items-center gap w-full md:w-auto">
                            {/* Role Filter */}
                            <div className="relative flex-1 md:flex-none">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="w-full md:w-[200px] h-11 pl-10 pr-8 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer appearance-none shadow-sm"
                                >
                                    {uniqueRolesForStaff.map(role => (
                                        <option key={role} value={role}>
                                            {role === "ALL" ? "All Roles" : ROLE_LABEL[role] ?? role}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* ── Staff Table ───────────────────────────────── */}
                <motion.div variants={item}>
                    <Card className="border-transparent shadow-premium overflow-hidden">
                        <Table>
                            <THead>
                                <TR className="bg-zinc-50/80">
                                    <TH className="py-4">Staff Member</TH>
                                    <TH className="py-4">Employee ID</TH>
                                    <TH className="py-4">System Role</TH>
                                    <TH className="py-4 text-right">Status</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {filteredStaff.length === 0 ? (
                                    <TR>
                                        <TD colSpan={5} className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                                    <Search className="h-6 w-6 text-zinc-400" />
                                                </div>
                                                <p className="text-zinc-900 font-bold text-lg">No staff found</p>
                                                <p className="text-zinc-500 font-medium mt-1">Try adjusting your search query or filters.</p>
                                            </div>
                                        </TD>
                                    </TR>
                                ) : (
                                    filteredStaff.map((user, i) => {
                                        const office = user.office ?? "Corporate";
                                        const style = OFFICE_STYLES[office] ?? OFFICE_STYLES["Corporate"];

                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                                                className="hover:bg-zinc-50/50 transition-colors group"
                                            >
                                                <TD>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0`}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="font-bold text-zinc-900 text-sm truncate">{user.name}</p>
                                                                <BadgeCheck className={`h-3.5 w-3.5 shrink-0 ${style.badgeText}`} />
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <Mail className="h-3 w-3 text-zinc-400 shrink-0" />
                                                                <p className="text-[10px] font-medium text-zinc-500 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TD>
                                                <TD>
                                                    <span className="font-mono text-[11px] font-bold text-zinc-600 bg-zinc-100/80 border border-zinc-200 px-2 py-1 rounded">
                                                        {user.employeeId}
                                                    </span>
                                                </TD>
                                                <TD>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                                                        {ROLE_LABEL[user.role] ?? user.role}
                                                    </span>
                                                </TD>
                                                <TD className="text-right">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                        Active
                                                    </span>
                                                </TD>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </TBody>
                        </Table>
                    </Card>
                </motion.div>

                {/* ── Customers Table ───────────────────────────── */}
                <motion.div variants={item}>
                    <div className="flex items-center gap-4 mb-5 pt-8">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight">Registered Customers</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{filteredCustomers.length} matching account holder{filteredCustomers.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex-1 h-px bg-zinc-200/60 ml-4" />
                    </div>

                    <Card className="border-transparent shadow-sm overflow-hidden bg-white/50">
                        <Table>
                            <THead>
                                <TR className="bg-zinc-50/50">
                                    <TH className="py-3">Account Holder</TH>
                                    <TH className="py-3">Email</TH>
                                    <TH className="py-3">Role Type</TH>
                                    <TH className="py-3 text-right">Status</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {filteredCustomers.length === 0 ? (
                                    <TR>
                                        <TD colSpan={4} className="text-center py-10">
                                            <p className="text-zinc-500 font-medium">No customers match your search.</p>
                                        </TD>
                                    </TR>
                                ) : (
                                    filteredCustomers.map((user, i) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(i * 0.05, 0.4) }}
                                            className="hover:bg-zinc-50/80 transition-colors"
                                        >
                                            <TD>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-black text-xs shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <p className="font-bold text-zinc-900 text-sm tracking-tight">{user.name}</p>
                                                </div>
                                            </TD>
                                            <TD>
                                                <p className="text-[11px] text-zinc-500 font-medium truncate">{user.email}</p>
                                            </TD>
                                            <TD>
                                                <span className="text-[9px] font-black uppercase tracking-widest border border-rose-100 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md">
                                                    Customer
                                                </span>
                                            </TD>
                                            <TD className="text-right">
                                                <span className="text-xs font-bold text-zinc-400">Verified</span>
                                            </TD>
                                        </motion.tr>
                                    ))
                                )}
                            </TBody>
                        </Table>
                    </Card>
                </motion.div>
            </motion.div>
        </>
    );
}
