/**
 * Agent Transaction Interfaces
 * Tracks A2A micropayments during receipt verification
 */

export interface AgentTransaction {
  agentId: string;
  agentName: string;
  serviceType: string;
  requestId: number;
  amount: number; // in tinybar
  amountHbar: number; // in HBAR
  amountUsd: number; // approximate USD value
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  duration?: number; // milliseconds
  result?: string; // result hash
}

export interface ReceiptVerificationJob {
  receiptId: string;
  totalCost: number;
  totalCostHbar: number;
  totalCostUsd: number;
  agentTransactions: AgentTransaction[];
  startTime: number;
  endTime?: number;
  totalDuration?: number;
}
