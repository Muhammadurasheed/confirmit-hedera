import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, Flag, Link as LinkIcon, Eye, FileText, Microscope, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TrustScoreGauge from '@/components/shared/TrustScoreGauge';
import { ReportFraudModal } from './ReportFraudModal';
import { ForensicDetailsModal } from './ForensicDetailsModal';
import { HederaAnchorModal } from './HederaAnchorModal';
import HederaBadge from '@/components/shared/HederaBadge';

interface ResultsDisplayProps {
  receiptId: string;
  receiptImageUrl?: string;
  ocrText?: string; // Add OCR text prop
  trustScore: number;
  verdict: 'authentic' | 'suspicious' | 'fraudulent' | 'unclear';
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendation: string;
  forensicDetails: {
    ocr_confidence: number;
    manipulation_score: number;
    metadata_flags: string[];
    forensic_summary?: string;
    techniques_detected?: string[];
    authenticity_indicators?: string[];
    forensic_findings?: Array<{
      category: string;
      severity: 'pass' | 'medium' | 'high' | 'critical';
      finding: string;
      explanation: string;
    }>;
    technical_details?: any;
    forensic_progress?: Array<{
      stage: string;
      message: string;
      progress: number;
      details?: Record<string, any>;
    }>;
    agent_logs?: Array<{
      agent: string;
      status: string;
      confidence?: number;
      manipulation_score?: number;
      flags?: number;
    }>;
  };
  merchant?: {
    name: string;
    verified: boolean;
    trust_score: number;
  } | null;
  hederaAnchor?: {
    transaction_id: string;
    consensus_timestamp: string;
    explorer_url: string;
  } | null;
}

const verdictConfig = {
  authentic: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Authentic',
  },
  suspicious: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Suspicious',
  },
  fraudulent: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Fraudulent',
  },
  unclear: {
    icon: HelpCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Unclear',
  },
};

export const ResultsDisplay = ({
  receiptId,
  receiptImageUrl,
  ocrText, // Destructure OCR text
  trustScore,
  verdict,
  issues = [],
  recommendation,
  forensicDetails,
  merchant,
  hederaAnchor,
}: ResultsDisplayProps) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showForensicModal, setShowForensicModal] = useState(false);
  const [showHederaModal, setShowHederaModal] = useState(false);
  const [showReportFraudModal, setShowReportFraudModal] = useState(false);

  // Defensive checks and data validation
  const safeIssues = Array.isArray(issues) ? issues : [];
  const safeForensicDetails = forensicDetails || {
    ocr_confidence: 0,
    manipulation_score: 0,
    metadata_flags: [],
  };
  const safeMetadataFlags = Array.isArray(safeForensicDetails.metadata_flags) 
    ? safeForensicDetails.metadata_flags 
    : [];

  // Normalize verdict to ensure it matches verdictConfig keys
  const normalizedVerdict = verdict?.toLowerCase() as keyof typeof verdictConfig;
  const config = verdictConfig[normalizedVerdict] || verdictConfig['unclear'];
  const VerdictIcon = config.icon;

  const handleAnchorToHedera = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/receipts/${receiptId}/anchor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to anchor to Hedera');
      }

      const data = await response.json();
      return {
        transactionId: data.hedera_anchor.transaction_id,
        explorerUrl: data.hedera_anchor.explorer_url,
      };
    } catch (error) {
      console.error('Hedera anchoring error:', error);
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Trust Score & Verdict */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <TrustScoreGauge score={trustScore} size="lg" />
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className={`p-3 rounded-full ${config.bgColor}`}>
                <VerdictIcon className={`h-8 w-8 ${config.color}`} />
              </div>
              <div>
                <Badge variant={verdict === 'authentic' ? 'default' : verdict === 'fraudulent' ? 'destructive' : 'secondary'} className="text-lg px-4 py-1">
                  {config.label}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Verification Results</h2>
              <p className="text-muted-foreground">Receipt ID: {receiptId}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendation Banner */}
      <Card className={`p-6 border-l-4 ${verdict === 'authentic' ? 'border-l-green-500' : verdict === 'fraudulent' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
        <h3 className="font-semibold mb-2">Recommendation</h3>
        <p className="text-sm">{recommendation}</p>
      </Card>

      {/* Issues */}
      {safeIssues.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Detected Issues ({safeIssues.length})</h3>
          <div className="space-y-3">
            {safeIssues.map((issue, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}>
                  {issue.severity}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium text-sm">{issue.type.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Merchant Info */}
      {merchant && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Merchant Information</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{merchant.name}</p>
              <p className="text-sm text-muted-foreground">Trust Score: {merchant.trust_score}/100</p>
            </div>
            {merchant.verified && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </Card>
      )}


      {/* Quick Actions */}
      <Card className="p-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowForensicModal(true)} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowHederaModal(true)} className="flex-1">
              <LinkIcon className="h-4 w-4 mr-2" />
              {hederaAnchor ? 'View Anchor' : 'Anchor on Hedera'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowReportFraudModal(true)} className="flex-1">
              <Flag className="h-4 w-4 mr-2" />
              Report Fraud
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hedera Badge */}
      {hederaAnchor && (
        <HederaBadge
          transactionId={hederaAnchor.transaction_id}
          explorerUrl={hederaAnchor.explorer_url}
          consensusTimestamp={hederaAnchor.consensus_timestamp}
        />
      )}

      {/* Modals */}
      <ReportFraudModal
        open={showReportFraudModal}
        onOpenChange={setShowReportFraudModal}
        receiptId={receiptId}
      />
      <ForensicDetailsModal
        open={showForensicModal}
        onOpenChange={setShowForensicModal}
        receiptId={receiptId}
        receiptImageUrl={receiptImageUrl}
        forensicDetails={safeForensicDetails}
        ocrText={ocrText}
        merchant={merchant}
      />
      <HederaAnchorModal
        open={showHederaModal}
        onOpenChange={setShowHederaModal}
        receiptId={receiptId}
        onAnchor={handleAnchorToHedera}
        existingAnchor={hederaAnchor || undefined}
      />
    </motion.div>
  );
};
