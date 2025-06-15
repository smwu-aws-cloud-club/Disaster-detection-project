import { useState, useEffect } from 'react';
import { getAccessToken, reissueToken } from '../utils/auth';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/members/me', {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (response.status === 401) {
        // Token expired, try to reissue
        const reissued = await reissueToken();
        if (reissued) {
          return fetchUserInfo(); // Retry with new token
        }
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (data: any) => {
    try {
      const response = await fetch('/api/members/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user info');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating user info:', error);
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/members/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return {
    user,
    loading,
    updateUserInfo,
    updatePassword,
    refreshUser: fetchUserInfo,
  };
}; 