import { getAccessToken } from './auth';
import { CCTVItem } from '../types/database';

export interface LocationOption {
  value: string;
  label: string;
  city: string;
  district: string;
}

export const getLocations = async (): Promise<LocationOption[]> => {
  try {
    const response = await fetch('/api/cctvs', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const cctvItems: CCTVItem[] = await response.json();
    
    // Create unique city-district combinations
    const uniqueLocations = new Map<string, LocationOption>();
    
    cctvItems.forEach(item => {
      const key = `${item.city} ${item.district}`;
      if (!uniqueLocations.has(key)) {
        uniqueLocations.set(key, {
          value: key,
          label: key,
          city: item.city,
          district: item.district
        });
      }
    });
    
    return Array.from(uniqueLocations.values());
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}; 