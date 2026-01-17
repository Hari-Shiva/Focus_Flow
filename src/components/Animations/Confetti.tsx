import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
    rotation: number;
}

const COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#ef4444', // red
    '#f97316', // orange
];

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
    pieces?: number;
}

export function Confetti({ isActive, duration = 3000, pieces = 50 }: ConfettiProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            // Generate confetti pieces
            const newConfetti: ConfettiPiece[] = Array.from({ length: pieces }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.3,
                duration: 2 + Math.random() * 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: 6 + Math.random() * 8,
                rotation: Math.random() * 360,
            }));

            setConfetti(newConfetti);
            setIsVisible(true);

            // Hide after duration
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration, pieces]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
            {confetti.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute top-0"
                    style={{
                        left: `${piece.x}%`,
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                    initial={{
                        y: -20,
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: window.innerHeight + 100,
                        rotate: piece.rotation + 720,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                />
            ))}
        </div>
    );
}
