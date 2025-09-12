import { SectionCards } from "@/modules/dashboard/home/section-cards";
import { SectionChartAppointments } from "@/modules/dashboard/home/section-chart-appointmets";
import { SectionHeader } from "@/modules/dashboard/home/section-header";
import { SectionSteps } from "@/modules/dashboard/home/progress/section-steps";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetzeen — Dashboard"
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <SectionHeader />
      <SectionSteps />
      <SectionCards />
      <SectionChartAppointments />
    </div>
  );
}