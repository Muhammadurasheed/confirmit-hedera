/**
 * Firebase Real-time Progress Listener
 * Listens to Firestore for AI agent progress updates
 * This is the CORRECT way to get real-time updates from AI agents
 */
import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AgentProgress {
  agent: string;
  stage: string;
  message: string;
  progress: number;
  timestamp: string;
  details?: Record<string, any>;
}

interface UseFirebaseReceiptProgressOptions {
  receiptId?: string;
  onProgress?: (data: AgentProgress) => void;
  onComplete?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useFirebaseReceiptProgress = ({
  receiptId,
  onProgress,
  onComplete,
  onError,
}: UseFirebaseReceiptProgressOptions) => {
  const [isListening, setIsListening] = useState(false);
  const callbacksRef = useRef({ onProgress, onComplete, onError });
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onProgress, onComplete, onError };
  }, [onProgress, onComplete, onError]);

  useEffect(() => {
    if (!receiptId || !db) {
      console.log('⚠️ No receipt ID or Firebase not initialized');
      return;
    }

    console.log(`🔥 Starting Firebase listener for receipt: ${receiptId}`);
    setIsListening(true);

    const receiptRef = doc(db, 'receipts', receiptId);

    // Real-time listener
    const unsubscribe = onSnapshot(
      receiptRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('🔥 Firebase update received:', data);

          // Check for progress updates (now using flat structure)
          if (data.progress_agent && data.progress_stage) {
            const progress: AgentProgress = {
              agent: data.progress_agent,
              stage: data.progress_stage,
              message: data.progress_message || '',
              progress: data.progress_percentage || 0,
              timestamp: data.progress_timestamp || new Date().toISOString(),
              details: {}
            };
            
            // Extract detail fields (progress_detail_*)
            Object.keys(data).forEach(key => {
              if (key.startsWith('progress_detail_')) {
                const detailKey = key.replace('progress_detail_', '');
                progress.details![detailKey] = data[key];
              }
            });
            
            console.log(`📊 [${progress.agent}] ${progress.message} (${progress.progress}%)`);
            callbacksRef.current.onProgress?.(progress);
          }

          // Check for completion - CRITICAL: Pass FULL document with proper parsing
          if (data.status === 'completed' && data.analysis) {
            console.log('✅ Analysis completed:', data);
            
            // Parse forensic_findings if it's a string
            let forensicDetails = data.analysis.forensic_details;
            if (forensicDetails) {
              // Parse forensic_findings if it's a JSON string
              if (typeof forensicDetails.forensic_findings === 'string') {
                try {
                  forensicDetails.forensic_findings = JSON.parse(forensicDetails.forensic_findings);
                  console.log('✅ Parsed forensic_findings from string');
                } catch (e) {
                  console.error('❌ Failed to parse forensic_findings:', e);
                  forensicDetails.forensic_findings = [];
                }
              }
              
              // Parse technical_details if it's a JSON string
              if (typeof forensicDetails.technical_details === 'string') {
                try {
                  forensicDetails.technical_details = JSON.parse(forensicDetails.technical_details);
                  console.log('✅ Parsed technical_details from string');
                } catch (e) {
                  console.error('❌ Failed to parse technical_details:', e);
                  forensicDetails.technical_details = {};
                }
              }
              
              // Parse techniques_detected if it's a JSON string
              if (typeof forensicDetails.techniques_detected === 'string') {
                try {
                  forensicDetails.techniques_detected = JSON.parse(forensicDetails.techniques_detected);
                  console.log('✅ Parsed techniques_detected from string');
                } catch (e) {
                  console.error('❌ Failed to parse techniques_detected:', e);
                  forensicDetails.techniques_detected = [];
                }
              }
              
              // Parse authenticity_indicators if it's a JSON string
              if (typeof forensicDetails.authenticity_indicators === 'string') {
                try {
                  forensicDetails.authenticity_indicators = JSON.parse(forensicDetails.authenticity_indicators);
                  console.log('✅ Parsed authenticity_indicators from string');
                } catch (e) {
                  console.error('❌ Failed to parse authenticity_indicators:', e);
                  forensicDetails.authenticity_indicators = [];
                }
              }
            }
            
            // Merge root-level fields with analysis object
            const completeData = {
              ...data.analysis,
              ocr_text: data.ocr_text || data.analysis.ocr_text || '',  // OCR text is at root level
              agent_logs: data.analysis.agent_logs || data.agent_logs || [],
              forensic_details: forensicDetails,
            };
            
            console.log('📊 Complete data structure:', {
              has_ocr_text: !!completeData.ocr_text,
              ocr_text_length: completeData.ocr_text?.length || 0,
              has_forensic_findings: Array.isArray(completeData.forensic_details?.forensic_findings),
              forensic_findings_count: completeData.forensic_details?.forensic_findings?.length || 0,
              has_technical_details: typeof completeData.forensic_details?.technical_details === 'object',
              technical_details_keys: Object.keys(completeData.forensic_details?.technical_details || {}),
              has_heatmap: Array.isArray(completeData.forensic_details?.heatmap),
              heatmap_rows: completeData.forensic_details?.heatmap?.length || 0,
            });
            
            callbacksRef.current.onComplete?.(completeData);
          }

          // Check for errors
          if (data.status === 'failed' && data.error) {
            console.error('❌ Analysis failed:', data.error);
            callbacksRef.current.onError?.(data.error);
          }
        } else {
          console.log('⚠️ Receipt document does not exist yet');
        }
      },
      (error) => {
        console.error('❌ Firebase listener error:', error);
        setIsListening(false);
        callbacksRef.current.onError?.(error);
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or receipt change
    return () => {
      console.log(`🔥 Stopping Firebase listener for receipt: ${receiptId}`);
      unsubscribe();
      unsubscribeRef.current = null;
      setIsListening(false);
    };
  }, [receiptId]);

  const stopListening = () => {
    if (unsubscribeRef.current) {
      console.log('🔥 Manually stopping Firebase listener');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsListening(false);
    }
  };

  return { isListening, stopListening };
};
