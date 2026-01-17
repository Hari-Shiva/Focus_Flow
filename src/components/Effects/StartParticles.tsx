import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function StartParticles({ trigger }: { trigger: boolean }) {
    const controls = useAnimation();

    useEffect(() => {
        if (trigger) {
            controls.start(_ => ({
                opacity: [1, 0],
                scale: [0, 1.5],
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                transition: { duration: 0.8, ease: "easeOut" }
            }));
        }
    }, [trigger, controls]);

    // Generate 12 particles
    const particles = Array.from({ length: 12 });

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    animate={controls}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    className="absolute w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                />
            ))}
        </div>
    );
}
