import { useEffect, useRef } from 'react';
import { CCTVItem } from '../types/database';
import { getCCTVStream, getCCTVData } from '../utils/cctv';

interface CCTVViewerProps {
  cctv: CCTVItem;
  onError?: (error: Error) => void;
}

export default function CCTVViewer({ cctv, onError }: CCTVViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let streamInterval: NodeJS.Timeout;
    let isMounted = true;

    const startStream = async () => {
      try {
        const streamUrl = await getCCTVStream(cctv.id);
        if (!isMounted || !videoRef.current) return;

        videoRef.current.src = streamUrl;
        await videoRef.current.play();

        // Refresh stream every 30 seconds
        streamInterval = setInterval(async () => {
          if (!isMounted || !videoRef.current) return;
          
          try {
            const blob = await getCCTVData(cctv.id);
            const url = URL.createObjectURL(blob);
            videoRef.current.src = url;
            await videoRef.current.play();
          } catch (error) {
            console.error('Error refreshing stream:', error);
            if (onError) onError(error as Error);
          }
        }, 30000);
      } catch (error) {
        console.error('Error starting stream:', error);
        if (onError) onError(error as Error);
      }
    };

    startStream();

    return () => {
      isMounted = false;
      if (streamInterval) {
        clearInterval(streamInterval);
      }
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    };
  }, [cctv.id, onError]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
} 