"use client";
import ChartComponent from "@/components/ChartComponents";
import ToolsComponent from "@/components/ToolsComponents";

export default function Dashboard() {
  return (
    <div className="relative h-screen">
        <div className="w-[66vw] h-[calc(100vh-64px)] mt-0 p-4">
            <ChartComponent />
        </div>
        <div className="fixed top-16 right-0 h-[calc(100vh-64px)] w-[24vw] p-4">
            <ToolsComponent />
        </div>
    </div>
  );
}
