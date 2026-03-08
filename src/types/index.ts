import { UserRole, ChequeStatus } from '../lib/constants';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    office?: string;
    employeeId?: string;
    password?: string; // For simulation only
}

export interface ChequeAuditLog {
    id: string;
    chequeId: string;
    action: string;
    performedBy: string;
    performedByRole: UserRole;
    timestamp: string;
    notes?: string;
}

export interface ChequeRequest {
    id: string;
    accountName: string;
    accountNumber: string;
    chequeNumber: string;
    amount: number;
    phoneNumber: string;
    bankBranch: string;
    status: ChequeStatus;
    submittedAt: string;
    submittedBy: string;
    currentOffice: string;
    logs: ChequeAuditLog[];
    timerStartedAt?: string; // For the 30-min countdown
}

export interface DashboardStats {
    totalRequests: number;
    totalUsers: number;
    activeCheques: number;
    completedCheques: number;
}
