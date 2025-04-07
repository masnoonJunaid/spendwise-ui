"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

interface ExpenseData {
  amount: number;
  name: string;
}

export const ExpenseCategoryChart = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const transactions = useSelector((state: any) => state.transactions?.transactions || []);
  const categoryList = useSelector((state: any) => state.categories?.categories || []);
  const [data, setData] = useState<ExpenseData[]>([]);

  useEffect(() => {
    if (!transactions.length || !categoryList.length) return;

    const expenseTransactions = transactions.filter(
      (t: any) => t.transaction_type === "expense"
    );

    const totals: Record<number, number> = {};

    expenseTransactions.forEach((t: any) => {
      const id = t.category;
      totals[id] = (totals[id] || 0) + parseFloat(t.amount);
    });

    const formattedData: ExpenseData[] = Object.entries(totals).map(([id, amount]) => {
      const category = categoryList.find((c: any) => c.id === Number(id));
      return {
        amount,
        name: category?.name || `Category ${id}`,
      };
    });

    setData(formattedData);
  }, [transactions, categoryList]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .html("");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<ExpenseData>().value((d) => d.amount);
    const arc = d3.arc<d3.PieArcDatum<ExpenseData>>().innerRadius(50).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(String(i)))
      .on("mouseover", function (event, d) {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.innerText = `${d.data.name}: ₹${d.data.amount.toFixed(2)}`;
        }
      })
      .on("mousemove", function (event) {
        if (tooltipRef.current && chartRef.current) {
          const bbox = chartRef.current.getBoundingClientRect();
          const offsetX = event.clientX - bbox.left;
          const offsetY = event.clientY - bbox.top;

          tooltipRef.current.style.left = `${offsetX + 10}px`;
          tooltipRef.current.style.top = `${offsetY + 10}px`;
        }
      })
      .on("mouseout", function () {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      });

    // LEGEND (same as before)
    if (legendRef.current) {
      const legendSvg = d3.select(legendRef.current);
      legendSvg.html("");

      const legend = legendSvg
        .attr("width", width)
        .attr("height", data.length * 20);

      const legendGroup = legend
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", (_, i) => `translate(0, ${i * 20})`);

      legendGroup
        .append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (_, i) => color(String(i)));

      legendGroup
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .style("font-size", "12px")
        .style("fill", "currentColor")
        .text((d) => d.name);
    }
  }, [data]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-center">Expense by Category</h3>
      <div className="relative">
        <svg ref={chartRef}></svg>
        <div
          ref={tooltipRef}
          className="absolute bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ display: "none", zIndex: 10 }}
        ></div>
      </div>
      <svg ref={legendRef}></svg>
    </div>
  );
};
