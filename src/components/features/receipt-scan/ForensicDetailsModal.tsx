import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, FileWarning, Bot, AlertTriangle, CheckCircle, Store } from "lucide-react";
import { ELAHeatmapViewer } from "./ELAHeatmapViewer";
import { Progress } from "@/components/ui/progress";
import { ForensicFindingsDisplay } from "./ForensicFindingsDisplay";
import { OCRTextDisplay } from "./OCRTextDisplay";
import TrustScoreGauge from "@/components/shared/TrustScoreGauge";

interface ForensicDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: string;
  receiptImageUrl?: string;
  forensicDetails: {
    ocr_confidence: number;
    manipulation_score: number;
    metadata_flags: string[];
    forensic_findings?: Array<{
      category: string;
      severity: 'pass' | 'medium' | 'high' | 'critical';
      finding: string;
      explanation: string;
    }>;
    forensic_progress?: Array<{
      stage: string;
      message: string;
      progress: number;
      details?: Record<string, any>;
    }>;
    technical_details?: {
      ela_analysis?: {
        manipulation_detected?: boolean;
        statistics?: {
          mean_error: number;
          max_error: number;
          std_error: number;
          bright_pixel_ratio: number;
        };
        suspicious_regions?: Array<{
          x: number;
          y: number;
          width: number;
          height: number;
          severity: number;
          mean_error: number;
          max_error: number;
        }>;
        heatmap?: number[][];
        image_dimensions?: { width: number; height: number };
        techniques?: string[];
        pixel_diff?: {
          diff_map: number[][];
          dimensions: { width: number; height: number };
          statistics: {
            changed_pixels: number;
            total_pixels: number;
            change_percentage: number;
            max_difference: number;
            mean_difference: number;
          };
          hotspots: Array<{
            x: number;
            y: number;
            width: number;
            height: number;
            intensity: number;
            changed_pixels: number;
          }>;
        };
      };
      pixel_results?: any;
      template_results?: any;
      metadata_results?: any;
      vision_data?: {
        total_amount?: string;
        receipt_date?: string;
      };
    };
    agent_logs?: Array<{
      agent: string;
      status: string;
      confidence?: number;
      manipulation_score?: number;
      flags?: number;
    }>;
  };
  ocrText?: string;
  merchant?: {
    name: string;
    verified: boolean;
    trust_score: number;
  } | null;
}

export const ForensicDetailsModal = ({
  open,
  onOpenChange,
  receiptId,
  receiptImageUrl,
  forensicDetails,
  ocrText,
  merchant,
}: ForensicDetailsModalProps) => {
  const elaAnalysis = forensicDetails.technical_details?.ela_analysis;
  const hasELAData = elaAnalysis && (elaAnalysis.heatmap || elaAnalysis.suspicious_regions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle>Complete Forensic Analysis</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Comprehensive breakdown of AI-powered receipt verification
          </p>
        </DialogHeader>

        <Tabs defaultValue="forensics" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="forensics">
              <Shield className="h-4 w-4 mr-2" />
              Forensics
            </TabsTrigger>
            <TabsTrigger value="ocr">
              <Eye className="h-4 w-4 mr-2" />
              Extracted Text
            </TabsTrigger>
            <TabsTrigger value="merchant">
              <Store className="h-4 w-4 mr-2" />
              Merchant
            </TabsTrigger>
            {hasELAData && (
              <TabsTrigger value="ela">
                <AlertTriangle className="h-4 w-4 mr-2" />
                ELA Heatmap
              </TabsTrigger>
            )}
            <TabsTrigger value="agents">
              <Bot className="h-4 w-4 mr-2" />
              AI Agents
            </TabsTrigger>
          </TabsList>

          {/* ELA Heatmap Tab */}
          {hasELAData && receiptImageUrl && (
            <TabsContent value="ela" className="space-y-4 mt-6">
              <ELAHeatmapViewer
                imageUrl={receiptImageUrl}
                heatmap={elaAnalysis.heatmap}
                suspiciousRegions={elaAnalysis.suspicious_regions}
                imageDimensions={elaAnalysis.image_dimensions}
                statistics={elaAnalysis.statistics}
                pixelDiff={elaAnalysis.pixel_diff}
              />
              
              {/* ELA Techniques Detected */}
              {elaAnalysis.techniques && elaAnalysis.techniques.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">ELA Findings</h4>
                    <ul className="space-y-2">
                      {elaAnalysis.techniques.map((technique, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{technique}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Forensics Tab - Primary Tab with Detailed Findings */}
          <TabsContent value="forensics" className="space-y-6 mt-6">
            {/* Granular Forensic Findings */}
            {forensicDetails.forensic_findings && forensicDetails.forensic_findings.length > 0 && (
              <ForensicFindingsDisplay 
                findings={forensicDetails.forensic_findings}
                manipulationScore={forensicDetails.manipulation_score}
              />
            )}

            {/* Confidence Scores Card */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Confidence Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">OCR Confidence</span>
                      <span className="text-sm font-bold">{forensicDetails.ocr_confidence}%</span>
                    </div>
                    <Progress value={forensicDetails.ocr_confidence} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Manipulation Risk</span>
                      <span className="text-sm font-bold">{forensicDetails.manipulation_score}%</span>
                    </div>
                    <Progress 
                      value={forensicDetails.manipulation_score} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Suspicious Regions Detected</span>
                      <span className="text-sm font-bold">
                        {elaAnalysis?.suspicious_regions?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata Flags */}
            {forensicDetails.metadata_flags && forensicDetails.metadata_flags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Metadata Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {forensicDetails.metadata_flags.map((flag, idx) => (
                      <Badge key={idx} variant="outline">{flag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* OCR Text Tab */}
          <TabsContent value="ocr" className="space-y-6 mt-6">
            <OCRTextDisplay
              ocrText={ocrText || ''}
              confidence={forensicDetails.ocr_confidence}
              merchant={merchant?.name}
              amount={forensicDetails.technical_details?.vision_data?.total_amount}
              date={forensicDetails.technical_details?.vision_data?.receipt_date}
            />
          </TabsContent>

          {/* Merchant Info Tab */}
          <TabsContent value="merchant" className="space-y-6 mt-6">
            {merchant ? (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{merchant.name}</h3>
                      <Badge variant={merchant.verified ? "default" : "secondary"} className="gap-1">
                        {merchant.verified && <CheckCircle className="h-3 w-3" />}
                        {merchant.verified ? 'Verified Merchant' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Merchant Trust Score</p>
                    <TrustScoreGauge score={merchant.trust_score} size="sm" />
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No merchant information available</p>
              </Card>
            )}
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
            {/* Agent Execution Logs */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Agent Execution Summary
              </h3>
              <div className="space-y-3">
                {forensicDetails.agent_logs && forensicDetails.agent_logs.length > 0 ? (
                  forensicDetails.agent_logs.map((log, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <span className="font-medium capitalize">{log.agent} Agent</span>
                          </div>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {log.confidence !== undefined && (
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="font-medium">{log.confidence}%</span>
                            </div>
                          )}
                          {log.manipulation_score !== undefined && (
                            <div className="flex justify-between">
                              <span>Manipulation Score:</span>
                              <span className="font-medium">{log.manipulation_score}%</span>
                            </div>
                          )}
                          {log.flags !== undefined && (
                            <div className="flex justify-between">
                              <span>Flags Detected:</span>
                              <span className="font-medium">{log.flags}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No agent execution logs available</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Forensic Progress Steps */}
            {forensicDetails.forensic_progress && forensicDetails.forensic_progress.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Forensic Analysis Steps
                </h3>
                <div className="space-y-2">
                  {forensicDetails.forensic_progress.map((step: any, idx: number) => (
                    <Card key={idx} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400">
                                {step.stage?.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {step.progress}%
                              </span>
                            </div>
                            <p className="text-sm">{step.message}</p>
                            {step.details && Object.keys(step.details).length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {Object.entries(step.details).map(([key, value]) => (
                                  <span key={key} className="text-xs px-2 py-0.5 rounded bg-muted">
                                    {key}: <span className="font-medium">{String(value)}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
