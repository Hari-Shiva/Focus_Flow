import { motion } from 'framer-motion';

export default function FloatingBlobs() {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            {/* Large Purple Blob */}
            <motion.div
                className="absolute w-96 h-96 bg-gradient-to-br from-fuchsia-500/30 to-purple-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ top: '10%', left: '10%' }}
            />

            {/* Cyan Blob */}
            <motion.div
                className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, -150, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ top: '40%', right: '5%' }}
            />

            {/* Pink Blob */}
            <motion.div
                className="absolute w-80 h-80 bg-gradient-to-br from-pink-500/30 to-rose-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, 80, 0],
                    y: [0, 120, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ bottom: '10%', left: '20%' }}
            />

            {/* Emerald Blob */}
            <motion.div
                className="absolute w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.25, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{ bottom: '20%', right: '15%' }}
            />
        </div>
    );
}
