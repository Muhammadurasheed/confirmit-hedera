import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Zap, 
  TrendingUp, 
  Activity, 
  Coins,
  Network,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentStats {
  agentId: string;
  serviceType: string;
  totalRequests: number;
  successRate: number;
  reputationScore: number;
  earnings: number;
  isActive: boolean;
}

interface A2ATransaction {
  id: string;
  from: string;
  to: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  transactionId: string;
}

export const AgentMarketplaceDashboard = () => {
  const [agents, setAgents] = useState<AgentStats[]>([
    {
      agentId: 'vision-agent-01',
      serviceType: 'Vision Analysis',
      totalRequests: 1247,
      successRate: 98.5,
      reputationScore: 985,
      earnings: 12.47,
      isActive: true,
    },
    {
      agentId: 'forensic-agent-01',
      serviceType: 'Forensic Analysis',
      totalRequests: 1189,
      successRate: 99.2,
      reputationScore: 992,
      earnings: 23.78,
      isActive: true,
    },
    {
      agentId: 'metadata-agent-01',
      serviceType: 'Metadata Validation',
      totalRequests: 1203,
      successRate: 97.8,
      reputationScore: 978,
      earnings: 9.62,
      isActive: true,
    },
    {
      agentId: 'reputation-agent-01',
      serviceType: 'Reputation Lookup',
      totalRequests: 1156,
      successRate: 99.5,
      reputationScore: 995,
      earnings: 8.67,
      isActive: true,
    },
    {
      agentId: 'reasoning-agent-01',
      serviceType: 'Reasoning Synthesis',
      totalRequests: 1203,
      successRate: 98.9,
      reputationScore: 989,
      earnings: 18.05,
      isActive: true,
    },
  ]);

  const [transactions, setTransactions] = useState<A2ATransaction[]>([
    {
      id: '1',
      from: 'Orchestrator',
      to: 'Vision Agent',
      serviceType: 'Image Analysis',
      amount: 0.01,
      status: 'completed',
      timestamp: new Date(Date.now() - 2000),
      transactionId: '0.0.7098369@1234567890.123456789',
    },
    {
      id: '2',
      from: 'Orchestrator',
      to: 'Forensic Agent',
      serviceType: 'ELA Detection',
      amount: 0.02,
      status: 'completed',
      timestamp: new Date(Date.now() - 5000),
      transactionId: '0.0.7098369@1234567891.123456789',
    },
    {
      id: '3',
      from: 'Orchestrator',
      to: 'Metadata Agent',
      serviceType: 'Field Validation',
      amount: 0.008,
      status: 'completed',
      timestamp: new Date(Date.now() - 8000),
      transactionId: '0.0.7098369@1234567892.123456789',
    },
  ]);

  const [marketplaceStats, setMarketplaceStats] = useState({
    totalAgents: 5,
    activeAgents: 5,
    totalTransactions: 6198,
    totalVolume: 72.59,
    avgResponseTime: 1.2,
    networkTPS: 3.8,
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'vision analysis':
      case 'image analysis':
        return '👁️';
      case 'forensic analysis':
      case 'ela detection':
        return '🔬';
      case 'metadata validation':
      case 'field validation':
        return '📋';
      case 'reputation lookup':
        return '⭐';
      case 'reasoning synthesis':
        return '🧠';
      default:
        return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Network className="h-6 w-6 text-purple-500" />
            </div>
            Agent Marketplace
          </h2>
          <p className="text-muted-foreground mt-1">
            Autonomous A2A fraud verification network on Hedera
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          <Activity className="h-4 w-4 mr-2 animate-pulse" />
          Live on Hedera Testnet
        </Badge>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Active Agents</p>
          </div>
          <p className="text-2xl font-bold">{marketplaceStats.activeAgents}</p>
          <p className="text-xs text-muted-foreground mt-1">of {marketplaceStats.totalAgents}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-warning" />
            <p className="text-xs font-medium text-muted-foreground">Total Requests</p>
          </div>
          <p className="text-2xl font-bold">{marketplaceStats.totalTransactions.toLocaleString()}</p>
          <p className="text-xs text-success mt-1">+12.5% today</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-success" />
            <p className="text-xs font-medium text-muted-foreground">Volume (HBAR)</p>
          </div>
          <p className="text-2xl font-bold">ℏ {marketplaceStats.totalVolume.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">~${(marketplaceStats.totalVolume * 0.05).toFixed(2)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-muted-foreground">Avg Response</p>
          </div>
          <p className="text-2xl font-bold">{marketplaceStats.avgResponseTime}s</p>
          <p className="text-xs text-success mt-1">-0.3s faster</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <p className="text-xs font-medium text-muted-foreground">Network TPS</p>
          </div>
          <p className="text-2xl font-bold">{marketplaceStats.networkTPS}</p>
          <p className="text-xs text-muted-foreground mt-1">transactions/sec</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <p className="text-xs font-medium text-muted-foreground">Success Rate</p>
          </div>
          <p className="text-2xl font-bold">98.7%</p>
          <p className="text-xs text-success mt-1">+0.2% today</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">
            <Bot className="h-4 w-4 mr-2" />
            Registered Agents
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Activity className="h-4 w-4 mr-2" />
            Live A2A Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.agentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getServiceIcon(agent.serviceType)}</div>
                      <div>
                        <h3 className="font-semibold">{agent.serviceType}</h3>
                        <p className="text-xs text-muted-foreground">{agent.agentId}</p>
                      </div>
                    </div>
                    <Badge className={agent.isActive ? 'bg-success' : 'bg-muted'}>
                      {agent.isActive ? 'Active' : 'Offline'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Reputation Score</span>
                        <span className="font-semibold">{agent.reputationScore}/1000</span>
                      </div>
                      <Progress value={agent.reputationScore / 10} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Requests</p>
                        <p className="text-sm font-semibold">{agent.totalRequests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success</p>
                        <p className="text-sm font-semibold text-success">{agent.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Earned</p>
                        <p className="text-sm font-semibold">ℏ {agent.earnings}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Real-Time A2A Transactions</h3>
              <Badge variant="secondary" className="ml-auto">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>

            <div className="space-y-2">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{getServiceIcon(tx.serviceType)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{tx.from}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{tx.to}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.serviceType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">ℏ {tx.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {tx.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {tx.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                All transactions recorded on Hedera HCS Topic 0.0.7098369
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
