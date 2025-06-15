import { getAccessToken } from './auth';
import { Region } from '../types/database';

export interface LocationOption {
  value: string;
  label: string;
  hasCCTV: boolean;
  lat: number;
  lng: number;
}

export const getLocations = async (): Promise<LocationOption[]> => {
  try {
    const response = await fetch('/api/regions', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const regions: Region[] = await response.json();
    
    return regions.map(region => ({
      value: region.region,
      label: region.region,
      hasCCTV: region.status,
      lat: 0, // These would need to be fetched from a separate mapping
      lng: 0, // These would need to be fetched from a separate mapping
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}; 