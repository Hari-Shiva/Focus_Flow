/**
 * Shared animation configurations for Framer Motion
 * Using these constants ensures consistent animation behavior across the app
 * and prevents re-creating animation objects on every render
 */

export const springConfig = {
    gentle: { type: "spring" as const, stiffness: 100, damping: 15 },
    bouncy: { type: "spring" as const, stiffness: 300, damping: 10 },
    slow: { type: "spring" as const, stiffness: 50, damping: 20 },
    snappy: { type: "spring" as const, stiffness: 400, damping: 25 },
};

export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const popIn = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 10 },
};
