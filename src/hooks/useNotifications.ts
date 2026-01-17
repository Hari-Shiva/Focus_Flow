import { useEffect, useState, useCallback } from 'react';

type NotificationPermission = 'default' | 'denied' | 'granted';

interface UseNotificationsReturn {
    permission: NotificationPermission;
    isSupported: boolean;
    requestPermission: () => Promise<boolean>;
    sendNotification: (title: string, options?: NotificationOptions) => void;
}

export function useNotifications(): UseNotificationsReturn {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const isSupported = typeof window !== 'undefined' && 'Notification' in window;

    useEffect(() => {
        if (isSupported) {
            setPermission(Notification.permission);
        }
    }, [isSupported]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported) return false;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch {
            return false;
        }
    }, [isSupported]);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (!isSupported || permission !== 'granted') return;

        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'focus-flow-timer',
            requireInteraction: false,
            silent: false,
            ...options,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Focus window on click
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }, [isSupported, permission]);

    return {
        permission,
        isSupported,
        requestPermission,
        sendNotification,
    };
}

// Helper function to send session complete notification
export function getSessionCompleteMessage(mode: 'work' | 'break' | 'longBreak'): { title: string; body: string } {
    switch (mode) {
        case 'work':
            return {
                title: '🎉 Focus Session Complete!',
                body: 'Great work! Time for a well-deserved break.',
            };
        case 'break':
            return {
                title: '⏰ Break Over',
                body: 'Ready to focus again?',
            };
        case 'longBreak':
            return {
                title: '🌟 Long Break Over',
                body: 'Feeling refreshed? Let\'s get back to it!',
            };
    }
}
