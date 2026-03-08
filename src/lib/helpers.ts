import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
}

export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}
