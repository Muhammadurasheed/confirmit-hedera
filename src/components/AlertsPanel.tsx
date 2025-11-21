import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "critical",
    message: "Unusual spending pattern detected in Nigeria region",
    time: "Just now",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "warning",
    message: "Multiple failed authentication attempts from new device",
    time: "5 mins ago",
    icon: Shield,
  },
  {
    id: 3,
    type: "info",
    message: "Transaction velocity increased by 45% in last hour",
    time: "15 mins ago",
    icon: TrendingUp,
  },
];

export const AlertsPanel = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const alertClass = {
            critical: "border-destructive bg-destructive/5",
            warning: "border-warning bg-warning/5",
            info: "border-accent bg-accent/5"
          }[alert.type];

          return (
            <Alert key={alert.id} className={alertClass}>
              <Icon className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{alert.message}</span>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
