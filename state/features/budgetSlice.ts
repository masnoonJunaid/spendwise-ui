import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';

export interface Budget {
  id: number;
  amount: number;
  month: string;
  user_id: string;
}

export interface BudgetSummary {
  month: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

interface BudgetState {
  currentBudget: Budget | null;
  addedBudget: Budget | null;
  summary: BudgetSummary | null;
  fetchBudgetStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  setBudgetStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchSummaryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addError: string | null;
}


const initialState: BudgetState = {
  currentBudget: null,
  addedBudget: null,
  summary: null,
  fetchBudgetStatus: 'idle',
  setBudgetStatus: 'idle',
  fetchSummaryStatus: 'idle',
  error: null,
  addError: null,
};


const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

// GET: View current budget
export const fetchBudget = createAsyncThunk(
  'budget/fetchBudget',
  async () => {
    const response = await fetch(`${BASE_URL}/budget/`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch budget');
    return (await response.json()) as Budget;
  }
);


export const setBudget = createAsyncThunk(
  'budget/setBudget',
  async (newBudget: Omit<Budget, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/budget/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // return server's error message
        return rejectWithValue(data?.error || 'Failed to set budget');
      }

      return data as Budget;
    } catch (error) {
      return rejectWithValue('Something went wrong');
    }
  }
);


// POST: Set a new budget

// GET: View budget summary for a specific month (YYYY-MM)
export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchBudgetSummary',
  async (month: string) => {
    const response = await fetch(`${BASE_URL}/budget-summary/${month}/`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch budget summary');
    return (await response.json()) as BudgetSummary;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBudget
      .addCase(fetchBudget.pending, (state) => {
        state.fetchBudgetStatus = 'loading';
      })
      .addCase(fetchBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.fetchBudgetStatus = 'succeeded';
        state.currentBudget = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.fetchBudgetStatus = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      })

      // setBudget
      .addCase(setBudget.pending, (state) => {
        state.setBudgetStatus = 'loading';
      })
      .addCase(setBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.setBudgetStatus = 'succeeded';
        state.addedBudget = action.payload;
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.setBudgetStatus = 'failed';
        state.addError = action.payload as string || 'Unknown error';
      })

      // fetchBudgetSummary
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.fetchSummaryStatus = 'loading';
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action: PayloadAction<BudgetSummary>) => {
        state.fetchSummaryStatus = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.fetchSummaryStatus = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      });
  },
});


export default budgetSlice.reducer;
