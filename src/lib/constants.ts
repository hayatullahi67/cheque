export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  BRANCH_CONTROLLER = 'BRANCH_CONTROLLER',
  TELLER = 'TELLER',
  TREASURY = 'TREASURY'
}

export enum ChequeStatus {
  SUBMITTED = 'SUBMITTED',
  RETURNED_FOR_ADJUSTMENT = 'RETURNED_FOR_ADJUSTMENT',
  APPROVED_BY_CUSTOMER_SERVICE = 'APPROVED_BY_CUSTOMER_SERVICE',
  VERIFIED_BY_BRANCH_CONTROLLER = 'VERIFIED_BY_BRANCH_CONTROLLER',
  FORWARDED_TO_TELLER = 'FORWARDED_TO_TELLER',
  AUTHORIZED_BY_TELLER = 'AUTHORIZED_BY_TELLER',
  PAID = 'PAID'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'System Administrator',
  [UserRole.USER]: 'Customer',
  [UserRole.CUSTOMER_SERVICE]: 'Customer Service Officer',
  [UserRole.BRANCH_CONTROLLER]: 'Branch Controller',
  [UserRole.TELLER]: 'Bank Teller',
  [UserRole.TREASURY]: 'Treasury Officer'
};

export const STATUS_LABELS: Record<ChequeStatus, string> = {
  [ChequeStatus.SUBMITTED]: 'Submitted',
  [ChequeStatus.RETURNED_FOR_ADJUSTMENT]: 'Returned for Adjustment',
  [ChequeStatus.APPROVED_BY_CUSTOMER_SERVICE]: 'Approved by CS',
  [ChequeStatus.VERIFIED_BY_BRANCH_CONTROLLER]: 'Verified by Controller',
  [ChequeStatus.FORWARDED_TO_TELLER]: 'Forwarded to Teller',
  [ChequeStatus.AUTHORIZED_BY_TELLER]: 'Authorized by Teller',
  [ChequeStatus.PAID]: 'Payment Released'
};

export const STATUS_COLORS: Record<ChequeStatus, string> = {
  [ChequeStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ChequeStatus.RETURNED_FOR_ADJUSTMENT]: 'bg-amber-100 text-amber-800 border-amber-200',
  [ChequeStatus.APPROVED_BY_CUSTOMER_SERVICE]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ChequeStatus.VERIFIED_BY_BRANCH_CONTROLLER]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ChequeStatus.FORWARDED_TO_TELLER]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [ChequeStatus.AUTHORIZED_BY_TELLER]: 'bg-teal-100 text-teal-800 border-teal-200',
  [ChequeStatus.PAID]: 'bg-emerald-100 text-emerald-800 border-emerald-200'
};
