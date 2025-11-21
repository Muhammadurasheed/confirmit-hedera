# ConfirmIT SDK

Official TypeScript/JavaScript SDK for **ConfirmIT** - AI-powered trust verification for African commerce.

## 🚀 Installation

```bash
npm install confirmit
# or
yarn add confirmit
```

## 🔑 Quick Start

```typescript
import ConfirmIT from 'confirmit';

// Initialize with your API key
const client = new ConfirmIT('your-api-key-here');

// Verify a receipt
const receiptResult = await client.verifyReceipt('https://example.com/receipt.jpg', {
  anchorOnHedera: true // Optional: Anchor result to Hedera blockchain
});

console.log(`Trust Score: ${receiptResult.trustScore}/100`);
console.log(`Verdict: ${receiptResult.verdict}`);
```

## 📖 Full Documentation

Visit [https://docs.confirmit.africa/sdk](https://docs.confirmit.africa/sdk) for complete API reference, examples, and guides.

## 🔐 Get Your API Key

1. Sign up at [https://confirmit.africa](https://confirmit.africa)
2. Go to Business Dashboard → API Keys
3. Generate your API key
4. Store it securely (never expose in client-side code)

## 💡 Core Features

- ✅ **Receipt Verification** - AI-powered authenticity checks
- ✅ **Account Checking** - Pre-payment trust scores
- ✅ **Fraud Reporting** - Community-driven protection
- ✅ **Webhook Validation** - Secure event handling
- ✅ **Hedera Blockchain** - Immutable proof anchoring

## 📜 License

MIT - See LICENSE file for details

**Built with ❤️ for Africa**
