import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentTransaction {
  agentName: string;
  serviceType: string;
  amount: number;
  amountHbar: number;
  transactionId: string;
  status: string;
  timestamp: string;
  duration?: number;
}

interface AgentMarketplaceData {
  enabled: boolean;
  total_cost_tinybar: number;
  total_cost_hbar: number;
  total_cost_usd: number;
  transactions: AgentTransaction[];
  agent_count: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  agentData: AgentMarketplaceData;
}

const AGENT_COLORS: Record<string, string> = {
  'Vision Agent': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Forensic Agent': 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  'Metadata Agent': 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'Reputation Agent': 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  'Reasoning Agent': 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
};

const AGENT_ICONS: Record<string, string> = {
  'Vision Agent': '👁️',
  'Forensic Agent': '🔬',
  'Metadata Agent': '📋',
  'Reputation Agent': '⭐',
  'Reasoning Agent': '🧠',
};

export const AgentCollaborationModal = ({ open, onClose, agentData }: Props) => {
  if (!agentData?.enabled) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            Behind the Scenes: A2A Agent Collaboration
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            This verification was powered by {agentData.agent_count} autonomous AI agents transacting on Hedera
          </p>
        </DialogHeader>

        {/* Cost Summary */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">ℏ{agentData.total_cost_hbar.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">${agentData.total_cost_usd.toFixed(4)} USD</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agents Used</p>
              <p className="text-2xl font-bold">{agentData.agent_count}</p>
              <p className="text-xs text-muted-foreground">Specialized AI</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Settlement</p>
              <p className="text-2xl font-bold">3.5s</p>
              <p className="text-xs text-muted-foreground">Avg. per TX</p>
            </div>
          </div>
        </Card>

        {/* Agent Transactions */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Micropayment Trail (A2A Protocol)
          </h3>
          
          {agentData.transactions.map((tx, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 bg-gradient-to-r ${AGENT_COLORS[tx.agentName] || 'from-muted/50 to-muted/30'} border`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl">{AGENT_ICONS[tx.agentName] || '🤖'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{tx.agentName}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {tx.serviceType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Completed in {tx.duration ? (tx.duration / 1000).toFixed(2) : '~3'} seconds
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="font-mono">ℏ{tx.amountHbar.toFixed(4)}</span>
                        </div>
                        <a
                          href={`https://hashscan.io/testnet/transaction/${tx.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="font-mono text-xs truncate max-w-[120px]">
                            {tx.transactionId}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30">
                      ✓ Paid
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Hedera Benefits */}
        <Card className="p-4 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            ⚡ Why Hedera for A2A?
          </h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="font-medium">3-5 Second Finality</p>
                <p className="text-xs text-muted-foreground">Predictable, consistent settlement</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">$0.0001 per Transaction</p>
                <p className="text-xs text-muted-foreground">10,000x cheaper than Ethereum</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="font-medium">10,000+ TPS Capacity</p>
                <p className="text-xs text-muted-foreground">Scales to millions of verifications</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="font-medium">ABFT Security</p>
                <p className="text-xs text-muted-foreground">Mathematically proven consensus</p>
              </div>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
