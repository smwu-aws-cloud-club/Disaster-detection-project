import { useState, useEffect } from 'react';
import { getFCMToken } from '../firebase';

export const useFCM = (userId: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const fcmToken = await getFCMToken();
          if (fcmToken) {
            setToken(fcmToken);
            // Save token to backend
            await fetch('/api/save-fcm-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: fcmToken,
                userId,
              }),
            });
          }
        } else {
          setError('Notification permission denied');
        }
      } catch (err) {
        setError('Failed to get FCM token');
        console.error('FCM Error:', err);
      }
    };

    requestNotificationPermission();
  }, [userId]);

  return { token, error };
}; 