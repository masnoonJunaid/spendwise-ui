import { BudgetVsExpenseChart } from "./charts/BudgetvsExpense"
import { ExpenseCategoryChart } from "./charts/ExpenseCategory"
import { ExpenseTrendChart } from "./charts/ExpenseTrend"

export default function ChartComponent() {





    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetVsExpenseChart/>
        <ExpenseCategoryChart />
        <ExpenseTrendChart/>
      </div>
    );
  }
  