import type { TimerMode } from '../types';

let permission: NotificationPermission = 'default';

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') {
        permission = 'granted';
        return true;
    }

    if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        permission = result;
        return result === 'granted';
    }

    return false;
}

export function sendNotification(mode: TimerMode): void {
    if (permission !== 'granted') return;

    const titles = {
        work: '🎯 Work Session Complete!',
        break: '☕ Break Complete!',
        longBreak: '🌟 Long Break Complete!',
    };

    const bodies = {
        work: 'Great job! Time for a well-deserved break.',
        break: 'Break time is over. Ready to focus again?',
        longBreak: 'Feeling refreshed? Let\'s get back to work!',
    };

    new Notification(titles[mode], {
        body: bodies[mode],
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'focus-flow-timer',
    });

}

// Request permission when module loads
if (typeof window !== 'undefined') {
    requestNotificationPermission();
}
