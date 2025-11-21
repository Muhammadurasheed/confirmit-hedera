/**
 * Agent Registration Script
 * Registers ConfirmIT's 5 AI agents on the Hedera Agent Marketplace smart contract
 * Run once to initialize the A2A marketplace
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { HederaService } from '../src/modules/hedera/hedera.service';
import { AgentServiceType } from '../src/modules/hedera/agent-sdk';

interface AgentConfig {
  agentId: string;
  name: string;
  serviceType: AgentServiceType;
  pricePerRequest: number; // in tinybar (100,000,000 tinybar = 1 HBAR)
  description: string;
}

const AGENTS: AgentConfig[] = [
  {
    agentId: 'confirmit-vision-agent-01',
    name: 'Vision Agent',
    serviceType: AgentServiceType.VISION_ANALYSIS,
    pricePerRequest: 1_000_000, // 0.01 HBAR (~$0.0006)
    description: 'Gemini Pro Vision - Extracts text, amounts, merchant info, dates',
  },
  {
    agentId: 'confirmit-forensic-agent-01',
    name: 'Forensic Agent',
    serviceType: AgentServiceType.FORENSIC_ANALYSIS,
    pricePerRequest: 1_500_000, // 0.015 HBAR (~$0.0009)
    description: 'OpenCV Computer Vision - ELA, clone detection, pixel analysis',
  },
  {
    agentId: 'confirmit-metadata-agent-01',
    name: 'Metadata Agent',
    serviceType: AgentServiceType.METADATA_VALIDATION,
    pricePerRequest: 500_000, // 0.005 HBAR (~$0.0003)
    description: 'Field validation, consistency checks, format verification',
  },
  {
    agentId: 'confirmit-reputation-agent-01',
    name: 'Reputation Agent',
    serviceType: AgentServiceType.REPUTATION_LOOKUP,
    pricePerRequest: 800_000, // 0.008 HBAR (~$0.0005)
    description: 'Merchant reputation lookup, fraud database queries',
  },
  {
    agentId: 'confirmit-reasoning-agent-01',
    name: 'Reasoning Agent',
    serviceType: AgentServiceType.REASONING_SYNTHESIS,
    pricePerRequest: 1_200_000, // 0.012 HBAR (~$0.0007)
    description: 'GPT-4 synthesis, final verdict, recommendations',
  },
];

async function main() {
  console.log('🚀 Starting Agent Registration Process...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const hederaService = app.get(HederaService);

  console.log('📋 Agents to Register:');
  AGENTS.forEach((agent, i) => {
    console.log(`${i + 1}. ${agent.name} (${agent.agentId})`);
    console.log(`   Service: ${AgentServiceType[agent.serviceType]}`);
    console.log(`   Price: ℏ${agent.pricePerRequest / 100_000_000} (~$${(agent.pricePerRequest / 100_000_000) * 0.06})`);
    console.log(`   ${agent.description}\n`);
  });

  console.log('⏳ Registering agents on Hedera smart contract...\n');

  const results = [];

  for (const agent of AGENTS) {
    try {
      console.log(`📝 Registering ${agent.name}...`);
      
      const result = await hederaService.registerAgentInMarketplace(
        agent.agentId,
        agent.serviceType,
        agent.pricePerRequest,
      );

      if (result.success) {
        console.log(`✅ ${agent.name} registered successfully!`);
        console.log(`   Transaction ID: ${result.transactionId}`);
        console.log(`   View on HashScan: https://hashscan.io/testnet/transaction/${result.transactionId}\n`);
        
        results.push({
          agent: agent.name,
          success: true,
          transactionId: result.transactionId,
        });
      } else {
        console.log(`❌ ${agent.name} registration failed\n`);
        results.push({
          agent: agent.name,
          success: false,
          error: 'Registration returned false',
        });
      }

      // Wait 2 seconds between registrations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error registering ${agent.name}:`, error.message);
      results.push({
        agent: agent.name,
        success: false,
        error: error.message,
      });
    }
  }

  console.log('\n📊 Registration Summary:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${AGENTS.length}`);
  console.log(`❌ Failed: ${failed}/${AGENTS.length}\n`);

  if (successful > 0) {
    console.log('🎉 Agent marketplace is ready!');
    console.log('💡 Agents can now autonomously transact on Hedera\n');
  }

  await app.close();
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
