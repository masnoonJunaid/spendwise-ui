"use client"
import BudgetPieChart from "./charts/PieChart";
import TransactionList from "./TransactionsList";
import { useEffect, useState } from "react";
import type { AppDispatch } from "@/state/store"; // Adjust the path to your Redux store
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgetSummary } from "@/state/features/budgetSlice";
import { Spinner } from "@heroui/react";

export default function ToolsComponent() {

  const [summaryMonth, setSummaryMonth] = useState(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const dispatch = useDispatch<AppDispatch>();
    const addTransactionStatus = useSelector((state: any) => state.transactions?.addTransactionStatus);

  useEffect(() => {
    dispatch(fetchBudgetSummary(summaryMonth))
  }, [summaryMonth, dispatch, addTransactionStatus]);

  const summaryData = useSelector((state: any) => state.budget.summary);
  console.log("Budget data >>>>", summaryData?.budget, summaryData?.total_expenses);


    return (
      <div className="space-y-4">
        <BudgetPieChart budget={summaryData?.budget} expense={summaryData?.total_expenses} />
        <TransactionList />
      </div>
    );
  }
  