import { motion, AnimatePresence } from 'framer-motion';

interface FlipNumberProps {
    value: string | number;
    className?: string;
}

export function FlipNumber({ value, className = "" }: FlipNumberProps) {
    return (
        <div className={`relative inline-block overflow-hidden ${className}`}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="block"
                    style={{ position: 'relative' }} // Changed from absolute to flow better? No, popLayout handles it.
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
