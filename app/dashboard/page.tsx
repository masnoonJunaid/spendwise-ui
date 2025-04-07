"use client";

import dynamic from "next/dynamic";

const ChartComponent = dynamic(() => import("@/components/ChartComponents"), {
  ssr: false,
});

const ToolsComponent = dynamic(() => import("@/components/ToolsComponents"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <div className="relative h-screen">
      {/* Main chart area */}
      <div className="w-[66vw] h-[calc(100vh-64px)] mt-0 p-4">
        <ChartComponent />
      </div>

      {/* Sidebar tools */}
      <div className="fixed top-16 right-0 h-[calc(100vh-64px)] w-[24vw] p-4">
        <ToolsComponent />
      </div>
    </div>
  );
}
