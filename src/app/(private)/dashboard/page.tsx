import type { Metadata } from "next";
import Dashboard from "./components/Dashboard";

export const metadata: Metadata = {
  title: "MotelHub | Dashboard",
  description: "Visualize métricas e desempenho do seu negócio",
};

export default function DashboardPage() {
  return <Dashboard />;
}
