"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";

interface Transaction {
  id: number;
  user: number;
  category: number;
  amount: string;
  transaction_type: "income" | "expense";
  description: string;
  date: string;
}

interface BudgetVsExpenseData {
  month: string;
  budget: number;
  expense: number;
}

export const BudgetVsExpenseChart = () => {
  const transactionList = useSelector((state: any) => state.transactions?.transactions || []);

  const transformTransactionsToChartData = (transactions: Transaction[]): BudgetVsExpenseData[] => {
    const grouped: Record<string, { budget: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = format(parseISO(t.date), "MMM yyyy");
      if (!grouped[month]) {
        grouped[month] = { budget: 0, expense: 0 };
      }
      if (t.transaction_type === "income") {
        grouped[month].budget += parseFloat(t.amount);
      } else {
        grouped[month].expense += parseFloat(t.amount);
      }
    });
    return Object.entries(grouped).map(([month, { budget, expense }]) => ({
      month,
      budget,
      expense,
    }));
  };
  const isDarkMode = document.documentElement.classList.contains('dark');

  const data = transformTransactionsToChartData(transactionList);
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 350;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(["Income", "Expense"])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.budget, d.expense)) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().domain(["Income", "Expense"]).range(["#10b981", "#ef4444"]);

    svg.attr("width", width).attr("height", height);

    // Chart Bars
    const group = svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.month)},0)`);

    group
      .selectAll("rect")
      .data((d) => [
        { key: "Income", value: d.budget },
        { key: "Expense", value: d.expense },
      ])
      .join("rect")
      .attr("x", (d) => x1(d.key) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => color(d.key) as string)
      .append("title")
      .text((d) => `${d.key}: ₹${d.value.toFixed(2)}`);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `₹${d}`))
      .style("font-size", "10px");

    // Y Axis Label
    svg
      .append("text")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Amount (₹)");

    // X Axis Label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Month (Income vs Expense)");

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 130}, ${margin.top})`);
    

    ["income", "expense"].forEach((key, i) => {
      const g = legend.append("g").attr("transform", `translate(40, ${i * 20})`); // changed x from 0 to 20
      g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(key) as string);
      g.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .style("fill", isDarkMode ? "#e5e7eb" : "#1f2937")
        .text(key.charAt(0).toUpperCase() + key.slice(1));
    });
      }, [data]);

  return (
    <svg ref={ref} className="w-full max-w-[600px] mx-auto"></svg>
     
    )
};
