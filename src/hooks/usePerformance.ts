import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
    fps: number;
    isLowPerformance: boolean;
}

/**
 * Hook to monitor application performance and detect low-end devices
 * Automatically tracks FPS and sets low performance flag if sustained low FPS
 */
export function usePerformance(): PerformanceMetrics {
    const [fps, setFps] = useState(60);
    const [isLowPerformance, setIsLowPerformance] = useState(false);
    const frameTimesRef = useRef<number[]>([]);
    const lastFrameTimeRef = useRef(performance.now());
    const lowFpsCountRef = useRef(0);

    useEffect(() => {
        let animationFrameId: number;

        const measureFPS = () => {
            const now = performance.now();
            const delta = now - lastFrameTimeRef.current;
            lastFrameTimeRef.current = now;

            // Calculate FPS from frame delta
            const currentFps = 1000 / delta;
            frameTimesRef.current.push(currentFps);

            // Keep only last 60 frames (1 second worth)
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }

            // Calculate average FPS every 60 frames
            if (frameTimesRef.current.length === 60) {
                const avgFps = frameTimesRef.current.reduce((a, b) => a + b, 0) / 60;
                setFps(Math.round(avgFps));

                // Track sustained low FPS
                if (avgFps < 30) {
                    lowFpsCountRef.current++;
                    // If FPS stays below 30 for 5 consecutive seconds, enable low performance mode
                    if (lowFpsCountRef.current >= 5) {
                        setIsLowPerformance(true);
                    }
                } else {
                    lowFpsCountRef.current = 0;
                    // Re-enable if performance improves
                    if (avgFps > 45) {
                        setIsLowPerformance(false);
                    }
                }

                frameTimesRef.current = [];
            }

            animationFrameId = requestAnimationFrame(measureFPS);
        };

        animationFrameId = requestAnimationFrame(measureFPS);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return { fps, isLowPerformance };
}
