import { AgentMarketplaceDashboard } from '@/components/features/hedera/AgentMarketplaceDashboard';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgentMarketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Container className="py-8 space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Info Banner */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <BookOpen className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                🚀 A2A Agent Marketplace - Hedera Hackathon Innovation
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                ConfirmIT's autonomous AI agents discover, negotiate, and transact with each other
                using Hedera's ultra-fast, low-cost network. Each fraud verification is powered by 
                5 specialized agents collaborating through smart contracts - creating the world's 
                first decentralized fraud prevention network.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://hashscan.io/testnet/topic/0.0.7098369" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View HCS Topic
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://hashscan.io/testnet/token/0.0.7158192" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Trust ID NFT
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://docs.hedera.com/hedera" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Hedera Docs
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Dashboard */}
        <AgentMarketplaceDashboard />

        {/* Technical Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">🔧 How It Works</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Agent Registration</h4>
              <p className="text-muted-foreground">
                Each AI agent registers on the Hedera smart contract with its service type, 
                pricing, and capabilities. Agents stake reputation on-chain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Service Discovery</h4>
              <p className="text-muted-foreground">
                The orchestrator queries the marketplace for the best agent based on reputation 
                score, success rate, and response time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Autonomous Payment</h4>
              <p className="text-muted-foreground">
                Agents pay each other in HBAR using Hedera's micropayment infrastructure. 
                Transactions cost ~$0.0001 and settle in 3-5 seconds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Reputation System</h4>
              <p className="text-muted-foreground">
                Every completed transaction updates agent reputation on-chain via HCS anchoring. 
                Better agents earn more requests and higher fees.
              </p>
            </div>
          </div>
        </Card>

        {/* Hackathon Alignment */}
        <Card className="p-6 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🏆 Hedera Ascension Hackathon Alignment
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-success font-semibold">✓</span>
              <div>
                <strong>AI & Agents Track:</strong> Multi-agent marketplace with A2A protocol 
                leveraging Agent Kit and autonomous coordination
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success font-semibold">✓</span>
              <div>
                <strong>Hedera Integration:</strong> HCS for anchoring + HTS for Trust NFTs + 
                Smart Contracts for agent marketplace + Micropayments
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success font-semibold">✓</span>
              <div>
                <strong>Real-World Impact:</strong> Solving ₦5B fraud crisis in Africa with 
                200M+ potential users across Nigeria, Ghana, Kenya
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success font-semibold">✓</span>
              <div>
                <strong>Network Effects:</strong> Every verification increases TPS, creates 
                accounts, and grows the fraud intelligence database
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AgentMarketplace;
