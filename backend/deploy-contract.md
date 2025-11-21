# Deploy Agent Marketplace Smart Contract to Hedera

## Prerequisites
- Node.js v18+
- Hedera testnet account with HBAR balance
- Hedera private key with ContractCreate permissions

## Steps

### 1. Install Dependencies
```bash
npm install --save-dev hardhat @hashgraph/hardhat-hedera @hashgraph/sdk
```

### 2. Create Hardhat Config
Create `hardhat.config.js`:
```javascript
require("@hashgraph/hardhat-hedera");

module.exports = {
  solidity: "0.8.20",
  hedera: {
    networks: {
      testnet: {
        url: "https://testnet.hedera.com",
        accounts: [process.env.HEDERA_PRIVATE_KEY],
        chainId: 296,
      }
    }
  }
};
```

### 3. Deploy Script
Create `scripts/deploy-agent-marketplace.js`:
```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying AgentMarketplace contract to Hedera Testnet...");

  const AgentMarketplace = await hre.ethers.getContractFactory("AgentMarketplace");
  const marketplace = await AgentMarketplace.deploy();

  await marketplace.deployed();

  console.log(`✅ AgentMarketplace deployed to: ${marketplace.address}`);
  console.log(`🔗 View on HashScan: https://hashscan.io/testnet/contract/${marketplace.address}`);
  
  // Update .env file with contract address
  console.log(`\n📝 Add to .env:`);
  console.log(`HEDERA_AGENT_MARKETPLACE_CONTRACT=${marketplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Deploy
```bash
npx hardhat run scripts/deploy-agent-marketplace.js --network testnet
```

### 5. Verify Contract (Optional)
```bash
npx hardhat verify --network testnet <CONTRACT_ADDRESS>
```

## Post-Deployment

1. Update `.env` with contract address:
```
HEDERA_AGENT_MARKETPLACE_CONTRACT=0.0.XXXXXXX
```

2. Register agents using the backend API:
```typescript
await hederaService.registerAgentInMarketplace(
  'vision-agent-01',
  AgentServiceType.VISION_ANALYSIS,
  1000000 // 0.01 HBAR in tinybar
);
```

3. Test agent discovery:
```typescript
const agents = await agentSDK.discoverAgents(AgentServiceType.VISION_ANALYSIS);
console.log('Available agents:', agents);
```

## Important Notes

- Deployment costs ~5-10 HBAR
- Contract address format: `0.0.XXXXXXX`
- Store contract address securely in environment variables
- Test all functions on testnet before mainnet deployment

## Troubleshooting

**Error: Insufficient HBAR balance**
- Request testnet HBAR from faucet: https://portal.hedera.com/faucet

**Error: Invalid private key**
- Ensure HEDERA_PRIVATE_KEY is DER-encoded format
- Use AccountId for operator, not EVM address

**Gas estimation failed**
- Increase gas limit in deployment script
- Check contract size (Hedera has 24KB limit)
