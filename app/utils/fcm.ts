import { getFCMToken } from '../firebase';
import { FCMToken } from '../types/database';

export const FCM_PERMISSION_KEY = 'fcm_permission_status';

export const checkNotificationPermission = () => {
  return localStorage.getItem(FCM_PERMISSION_KEY) === 'granted';
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(FCM_PERMISSION_KEY, permission);
    
    if (permission === 'granted') {
      const token = await getFCMToken();
      if (token) {
        // Get the current user's info
        const userResponse = await fetch('/api/members/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to get user info');
        }

        const userData = await userResponse.json();

        // Create FCM token data
        const fcmTokenData: FCMToken = {
          token,
          createdAt: Date.now(),
          expireAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
          topics: ['all'], // Default topic
          fcmSubStatus: 'ACTIVE',
          lastSubscriptionAttemptAt: Date.now()
        };

        // Send token to backend
        await fetch('/api/token-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(fcmTokenData),
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}; 