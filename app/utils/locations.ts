import { getAccessToken } from './auth';
import { CCTVItem } from '../types/database';

export interface LocationOption {
  city: string;
  districts: string[];
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
    const cityMap = new Map<string, Set<string>>();
    
    cctvItems.forEach(item => {
      if (!cityMap.has(item.city)) {
        cityMap.set(item.city, new Set());
      }
      cityMap.get(item.city)?.add(item.district);
    });
    
    return Array.from(cityMap.entries()).map(([city, districts]) => ({
      city,
      districts: Array.from(districts)
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    // Return empty array if API fails
    return [];
  }
}; 