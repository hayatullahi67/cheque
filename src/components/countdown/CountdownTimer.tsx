'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/helpers';

export interface CountdownTimerProps {
    initialMinutes?: number;
    onUpdate?: (minutes: number, seconds: number) => void;
    onComplete?: () => void;
    className?: string;
}

export function CountdownTimer({
    initialMinutes = 30,
    onUpdate,
    onComplete,
    className
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete?.();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                onUpdate?.(Math.floor(next / 60), next % 60);
                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete, onUpdate]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 font-mono text-sm font-bold text-indigo-700 border border-indigo-100",
            className
        )}>
            <Timer className="h-4 w-4" />
            <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
}
