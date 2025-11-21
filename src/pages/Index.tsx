import { MetricCard } from "@/components/MetricCard";
import { TransactionList } from "@/components/TransactionList";
import { AlertsPanel } from "@/components/AlertsPanel";
import { Shield, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-security flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Confirmit</h1>
                <p className="text-sm text-muted-foreground">Fraud Mitigation Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Protection Status</p>
                <p className="text-sm font-semibold text-success">Active</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Blocked Transactions"
            value="127"
            change="+12% from last week"
            changeType="positive"
            icon={Shield}
          />
          <MetricCard
            title="Fraud Rate"
            value="0.43%"
            change="-0.08% from last week"
            changeType="positive"
            icon={TrendingDown}
          />
          <MetricCard
            title="Active Alerts"
            value="23"
            change="+5 in last hour"
            changeType="negative"
            icon={AlertTriangle}
          />
          <MetricCard
            title="Amount Saved"
            value="$45,231"
            change="+$12,450 this week"
            changeType="positive"
            icon={DollarSign}
          />
        </div>

        {/* Alerts and Transactions */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
