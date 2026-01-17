import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    angle: number;
    distance: number;
    size: number;
    color: string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export function StartParticles({ isActive }: { isActive: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            const count = 20;
            const newParticles = Array.from({ length: count }, (_, i) => ({
                id: i,
                angle: (i / count) * 360,
                distance: 100 + Math.random() * 100,
                size: 4 + Math.random() * 6,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }));

            setParticles(newParticles);
            setIsVisible(true);

            const timer = setTimeout(() => setIsVisible(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                        x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                        y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                        opacity: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
}
