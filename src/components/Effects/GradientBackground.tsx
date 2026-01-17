import { useEffect, useState } from 'react';
import { useTimerStore } from '../../stores/timerStore';

/**
 * Dynamic gradient background that shifts based on timer mode
 * Pure CSS implementation for maximum performance (GPU accelerated)
 */
export default function GradientBackground() {
    const { mode } = useTimerStore();
    const [gradientClass, setGradientClass] = useState('gradient-work');

    useEffect(() => {
        switch (mode) {
            case 'work':
                setGradientClass('gradient-work');
                break;
            case 'break':
                setGradientClass('gradient-break');
                break;
            case 'longBreak':
                setGradientClass('gradient-long-break');
                break;
            default:
                setGradientClass('gradient-work');
        }
    }, [mode]);

    return (
        <div
            className={`fixed inset-0 -z-10 transition-all duration-1000 ${gradientClass}`}
            style={{
                willChange: 'background',
                transform: 'translateZ(0)',
                contain: 'layout style paint'
            }}
        />
    );
}
