/**
 * ConfirmIT SDK - Official TypeScript/JavaScript Client
 * AI-powered trust verification for African commerce
 */

export interface ConfirmITOptions {
  baseUrl?: string;
  timeout?: number;
}

export interface ReceiptVerificationOptions {
  anchorOnHedera?: boolean;
}

export interface ReceiptResult {
  receiptId: string;
  trustScore: number;
  verdict: 'authentic' | 'suspicious' | 'fraudulent' | 'unclear';
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendation: string;
  forensicDetails?: {
    ocrConfidence: number;
    manipulationScore: number;
    metadataFlags: string[];
  };
  merchant?: {
    name: string;
    verified: boolean;
    trustScore: number;
  };
  hederaAnchor?: {
    transactionId: string;
    consensusTimestamp: string;
    explorerUrl: string;
  };
}

export interface AccountResult {
  accountHash: string;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  fraudReports: {
    total: number;
    recent30Days: number;
  };
  verifiedBusiness?: {
    businessId: string;
    name: string;
    verified: boolean;
    trustScore: number;
  };
  flags: string[];
}

export interface FraudReportResult {
  success: boolean;
  message: string;
  reportId: string;
}

/**
 * ConfirmIT API Client
 */
export class ConfirmIT {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(apiKey: string, options: ConfirmITOptions = {}) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.confirmit.africa/api';
    this.timeout = options.timeout || 60000; // 60 seconds
  }

  /**
   * Verify receipt authenticity using AI forensics
   * 
   * @param imageUrl - Public URL of the receipt image
   * @param options - Verification options (optional)
   * @returns Receipt verification result
   * 
   * @example
   * ```typescript
   * const client = new ConfirmIT('your-api-key');
   * const result = await client.verifyReceipt('https://example.com/receipt.jpg', {
   *   anchorOnHedera: true
   * });
   * 
   * console.log(`Trust Score: ${result.trustScore}`);
   * console.log(`Verdict: ${result.verdict}`);
   * ```
   */
  async verifyReceipt(
    imageUrl: string,
    options: ReceiptVerificationOptions = {}
  ): Promise<ReceiptResult> {
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const response = await this.request('/receipts/scan', {
      method: 'POST',
      body: JSON.stringify({
        imageUrl,
        anchorOnHedera: options.anchorOnHedera || false,
      }),
    });

    return response.data;
  }

  /**
   * Check account trustworthiness before sending money
   * 
   * @param accountNumber - Bank account number
   * @param bankCode - Bank code (e.g., "058" for GTBank)
   * @param businessName - Optional business name for verification
   * @returns Account trust score and risk assessment
   * 
   * @example
   * ```typescript
   * const client = new ConfirmIT('your-api-key');
   * const result = await client.checkAccount('0123456789', '058');
   * 
   * if (result.riskLevel === 'high') {
   *   console.log('⚠️ High risk account! Proceed with caution.');
   * }
   * ```
   */
  async checkAccount(
    accountNumber: string,
    bankCode: string,
    businessName?: string
  ): Promise<AccountResult> {
    if (!accountNumber || !bankCode) {
      throw new Error('Account number and bank code are required');
    }

    const response = await this.request('/accounts/check', {
      method: 'POST',
      body: JSON.stringify({
        accountNumber,
        bankCode,
        businessName,
      }),
    });

    return response.data;
  }

  /**
   * Report fraudulent activity on an account
   * 
   * @param accountNumber - Bank account number to report
   * @param category - Fraud category (e.g., "fake_product", "non_delivery")
   * @param description - Detailed description of the fraud
   * @returns Fraud report confirmation
   * 
   * @example
   * ```typescript
   * const client = new ConfirmIT('your-api-key');
   * const result = await client.reportFraud(
   *   '0123456789',
   *   'fake_product',
   *   'Received counterfeit phone instead of original'
   * );
   * ```
   */
  async reportFraud(
    accountNumber: string,
    category: string,
    description: string
  ): Promise<FraudReportResult> {
    if (!accountNumber || !category || !description) {
      throw new Error('Account number, category, and description are required');
    }

    const response = await this.request('/accounts/report-fraud', {
      method: 'POST',
      body: JSON.stringify({
        accountNumber,
        category,
        description,
      }),
    });

    return response;
  }

  /**
   * Validate webhook signature for security
   * 
   * @param signature - Signature from webhook header
   * @param payload - Raw webhook payload body
   * @param secret - Your webhook secret key
   * @returns True if signature is valid
   * 
   * @example
   * ```typescript
   * // In your webhook endpoint
   * const signature = req.headers['x-confirmit-signature'];
   * const isValid = ConfirmIT.validateWebhook(
   *   signature,
   *   req.body,
   *   process.env.WEBHOOK_SECRET
   * );
   * 
   * if (!isValid) {
   *   return res.status(401).send('Invalid signature');
   * }
   * ```
   */
  static validateWebhook(
    signature: string,
    payload: string,
    secret: string
  ): boolean {
    if (!signature || !payload || !secret) {
      return false;
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Internal request handler
   */
  private async request(endpoint: string, options: RequestInit): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errBody: any = await response.json().catch(() => ({}));
        throw new Error((errBody && errBody.message) || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }

      throw error;
    }
  }
}

// Export default for convenience
export default ConfirmIT;
