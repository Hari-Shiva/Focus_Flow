import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    rotation: number;
    color: string;
}

interface ConfettiEffectProps {
    isActive: boolean;
}

const COLORS = [
    '#667eea', // Indigo
    '#764ba2', // Purple
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#ef4444', // Red
];

export default function ConfettiEffect({ isActive }: ConfettiEffectProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (isActive) {
            // Generate 40 confetti pieces
            const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
                id: i,
                x: Math.random() * 100, // Random horizontal position (%)
                delay: Math.random() * 0.3, // Stagger animation
                rotation: Math.random() * 360, // Random initial rotation
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }));

            setConfetti(pieces);

            // Clean up after animation completes
            const timer = setTimeout(() => {
                setConfetti([]);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isActive]);

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isActive || confetti.length === 0 || prefersReducedMotion) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {confetti.map((piece) => (
                    <motion.div
                        key={piece.id}
                        className="absolute w-3 h-3 rounded-sm"
                        style={{
                            left: `${piece.x}%`,
                            top: '-10px',
                            backgroundColor: piece.color,
                            rotate: piece.rotation,
                        }}
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{
                            y: window.innerHeight + 100,
                            opacity: [1, 1, 0],
                            scale: [1, 0.8, 0.6],
                            rotate: piece.rotation + (Math.random() > 0.5 ? 720 : -720),
                        }}
                        transition={{
                            duration: 2.5,
                            delay: piece.delay,
                            ease: [0.36, 0, 0.66, -0.56], // Custom cubic bezier for falling effect
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
