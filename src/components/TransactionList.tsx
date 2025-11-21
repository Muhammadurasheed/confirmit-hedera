import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  time: string;
  risk: "high" | "medium" | "low";
  location: string;
}

const mockTransactions: Transaction[] = [
  { id: "TXN-001", merchant: "Online Store XYZ", amount: "$2,450.00", time: "2 mins ago", risk: "high", location: "Nigeria" },
  { id: "TXN-002", merchant: "Coffee Shop", amount: "$4.50", time: "1 hour ago", risk: "low", location: "New York, US" },
  { id: "TXN-003", merchant: "Electronics Store", amount: "$899.99", time: "3 hours ago", risk: "medium", location: "London, UK" },
  { id: "TXN-004", merchant: "Restaurant ABC", amount: "$67.80", time: "5 hours ago", risk: "low", location: "San Francisco, US" },
  { id: "TXN-005", merchant: "Unknown Vendor", amount: "$1,200.00", time: "6 hours ago", risk: "high", location: "Unknown" },
];

export const TransactionList = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{transaction.merchant}</p>
                  <RiskBadge risk={transaction.risk} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {transaction.id} • {transaction.location}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
