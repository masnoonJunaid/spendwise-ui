"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

interface Transaction {
  amount: string;
  date: string;
  transaction_type: "income" | "expense";
}

export const ExpenseTrendChart = () => {
  const transactionList: Transaction[] = useSelector(
    (state: any) => state.transactions?.transactions || []
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = transactionList
      .filter((t) => t.transaction_type === "expense")
      .map((t) => ({
        date: new Date(t.date),
        amount: parseFloat(t.amount),
      }));

    if (data.length === 0) return;

    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.amount)! * 1.1])
      .range([height, 0]);

    // Line generator
    const line = d3
      .line<{ date: Date; amount: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.amount))
      .curve(d3.curveMonotoneX);

    // Draw the line
    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    // X Axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => d3.timeFormat("%b %d")(d as Date)))
      .selectAll("text")
      .style("font-size", "10px");

    // Y Axis
    chart
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "10px");

    // Y Axis Label
    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Expense Amount (₹)");

    // Chart Title
    chart
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Expense Trends (Line Chart)");

    // Legend
    chart
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", -10)
      .attr("r", 6)
      .style("fill", "#3b82f6");

    chart
      .append("text")
      .attr("x", width - 70)
      .attr("y", -6)
      .attr("font-size", "12px")
      .text("Expense (₹)");

    // Tooltip group
    const focus = chart.append("g").style("display", "none");

    focus.append("circle").attr("r", 5).attr("fill", "#ef4444");

    const tooltip = chart
      .append("text")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .style("background", "#fff")
      .style("pointer-events", "none");

    // Overlay for interaction
    chart
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.text("");
      })
      .on("mousemove", function (event) {
        const bisect = d3.bisector((d: any) => d.date).left;
        const mouseX = d3.pointer(event, this)[0];
        const xDate = x.invert(mouseX);
        const i = bisect(data, xDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;

        const xPos = x(d.date);
        const yPos = y(d.amount);

        focus.attr("transform", `translate(${xPos},${yPos})`);
        tooltip
          .attr("x", xPos + 10)
          .attr("y", yPos - 10)
          .text(`₹${d.amount.toFixed(2)} on ${d3.timeFormat("%b %d")(d.date)}`);
      });
  }, [transactionList]);

  return (
    <div style={{ textAlign: "center" }}>
      <svg ref={svgRef}></svg>
      <p style={{ fontSize: "14px", marginTop: "10px", color: "#555" }}>
        Expense Trends Over Time
      </p>
    </div>
  );
};
