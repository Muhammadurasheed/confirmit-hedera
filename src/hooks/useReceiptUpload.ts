import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/constants';

export interface UploadProgress {
  progress: number;
  status: string;
  message: string;
}

export const useReceiptUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
    message: '',
  });

  const uploadReceipt = useCallback(async (file: File, options?: { anchorOnHedera?: boolean }) => {
    setIsUploading(true);
    setProgress({ progress: 0, status: 'uploading', message: 'Preparing upload...' });

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      if (options?.anchorOnHedera) {
        formData.append('anchorOnHedera', 'true');
      }

      // Upload to backend
      const response = await fetch(API_ENDPOINTS.SCAN_RECEIPT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setProgress({ progress: 100, status: 'complete', message: 'Upload successful!' });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setProgress({ progress: 0, status: 'error', message: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const updateProgress = useCallback((update: Partial<UploadProgress>) => {
    setProgress((prev) => ({ ...prev, ...update }));
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress({ progress: 0, status: 'idle', message: '' });
  }, []);

  return {
    isUploading,
    progress,
    uploadReceipt,
    updateProgress,
    reset,
  };
};
