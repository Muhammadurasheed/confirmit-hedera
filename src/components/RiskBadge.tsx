import { Badge } from "@/components/ui/badge";

interface RiskBadgeProps {
  risk: "high" | "medium" | "low";
}

export const RiskBadge = ({ risk }: RiskBadgeProps) => {
  const styles = {
    high: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    medium: "bg-warning text-warning-foreground hover:bg-warning/90",
    low: "bg-success text-success-foreground hover:bg-success/90"
  }[risk];

  const label = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk"
  }[risk];

  return (
    <Badge className={styles}>
      {label}
    </Badge>
  );
};
