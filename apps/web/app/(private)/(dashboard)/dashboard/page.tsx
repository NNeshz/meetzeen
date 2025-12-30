import { MetricsHeader } from "@/modules/metrics/components/metrics-header";
import { MetricsViews } from "@/modules/metrics/components/metrics-views";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <MetricsHeader />
      <MetricsViews />
    </div>
  );
}
