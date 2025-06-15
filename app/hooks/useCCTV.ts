import { useState } from 'react';
import { CCTVItem, getCCTVList, getCCTVById, getCCTVStream, getCCTVData } from '../utils/cctv';

export function useCCTV() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCCTVList = async (address: string): Promise<CCTVItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const cctvs = await getCCTVList(address);
      return cctvs;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCCTVById = async (id: number): Promise<CCTVItem> => {
    setLoading(true);
    setError(null);
    try {
      const cctv = await getCCTVById(id);
      return cctv;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCCTVStream = async (id: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const streamUrl = await getCCTVStream(id);
      return streamUrl;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCCTVData = async (id: number): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCCTVData(id);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchCCTVList,
    fetchCCTVById,
    fetchCCTVStream,
    fetchCCTVData,
  };
} 