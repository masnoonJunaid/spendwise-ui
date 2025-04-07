"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@heroui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/state/store"; // Adjust the path to your Redux store
// import Draggable from "react-draggable";


export const caseStatusMenuItem = [
  {
    label: "Active",
    key: "active", // Added this category with a correct key
    description: "Cases involving environmental laws and conservation."
  },
  {
    label: "Pending",
    key: "pending",
    description: "Some useless description"
  },
  {
    label: "Resolved",
    key: 'resolved',
    description:"Resolved description"
  }
]

import { 
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
  Textarea,
  Spinner
 } from "@heroui/react";
import { fetchBudgetSummary, setBudget } from "@/state/features/budgetSlice";
import { displayToast } from "@/utils/functions";


interface BudgetSummary {
  budget: number;
  expense: number;
}

interface Props {
  month: string; // Format: "YYYY-MM"
}

const BudgetPieChart = ({ budget, expense }: { budget: number; expense: number }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const budgetUpdate = useSelector((state: any) => state.budget);

  const dispatch = useDispatch<AppDispatch>();

  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });



  const remaining = Math.max(budget - expense, 0);
  const spentPercent = Math.min((expense / budget) * 100, 100).toFixed(1);

  const data = [
    {
      label: "Expense",
      value: expense,
      color: "#ef4444", 
    },
    {
      label: "Remaining",
      value: remaining,
      color: "#22c55e", 
    },
  ];
  
  useEffect(() => {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    if (!ref.current) return;

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .html(""); // clear previous

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<{ label: string; value: number; color: string }>().value((d) => d.value);
    const arc = d3.arc().innerRadius(60).outerRadius(radius);

    const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", (d) => arc(d as unknown as d3.DefaultArcObject))
      .attr("fill", (d) => d.data.color);

    // Add text in center
    g.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.25em")
  .attr("class", "text-xl font-bold fill-gray-800 dark:fill-gray-200")
  .selectAll("tspan")
  .data([`${expense}`, "Expense"])
  .enter()
  .append("tspan")
  .attr("x", 0)
  .attr("dy", (_d, i) => i === 0 ? 0 : "1.2em")
  .text(d => d);
  }
    , [data]);
  
  
  const handleCreateBudget = async (onClose: () => void) => {
    const userId = localStorage?.getItem('userId');
    if (!userId || !amount || !month) return;

    try {
      await dispatch(setBudget({
        amount: parseFloat(amount),
        month,
        user_id: userId,
      })).unwrap();
      onClose(); // Close modal on success
    } catch (err) {
    }
  };

  useEffect(() => {
    if(budgetUpdate?.setBudgetStatus === 'succeeded') {
      displayToast("Budget added successfully", "", "sm", "success");
    } 
    if(budgetUpdate?.setBudgetStatus === 'failed') {
      displayToast(budgetUpdate?.addError, "", "sm", "danger");
    }
  }, [budgetUpdate?.setBudgetStatus])
  
  const summaryLoading = useSelector((state: any) => state.budget?.fetchSummaryStatus);


  return (
    <div>
      <div className="flex flex-col gap-2 items-end mr-20">
        <Button isLoading ={budgetUpdate?.setBudgetStatus === 'loading'} onPress={() => onOpen()} className="max-w-[9rem]" size="sm" color="primary">
          Add Budget +
        </Button>
            {/* <Draggable> */}
        <Modal size="sm" isOpen={isOpen} backdrop="blur" placement="top-center" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add Budget</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Amount"
                      type="number"
                      placeholder="Enter budget amount"
                      size="sm"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Input
                      label="Month"
                      type="month"
                      placeholder="Select month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      // helperText="Format: YYYY-MM"
                      // visibleMonths={1}
                      size="sm"
                      // onChange={(date) => setMonth(date ? `${date.year}-${String(date.month).padStart(2, '0')}` : '')}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => handleCreateBudget(onClose)}
                    isDisabled={!amount || !month}
                    isLoading={budgetUpdate?.setBudgetStatus === 'loading'}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      { summaryLoading === 'loading' ? <Spinner/>: 
        <div className="flex flex-col items-center  p-4 rounded-xl shadow-md w-fit">
          <svg ref={ref}></svg>
          <div className="mt-4 text-sm fill-gray-800 dark:fill-gray-200">
            Budget : ₹{budget}
          </div>
        </div>
  }
    </div>
    
  );
};

export default BudgetPieChart;
