import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
}

// Fix your interface
export interface NewTransaction {
  amount: number;
  transaction_type: 'income' | 'expense';
  description?: string;
  date: string;
  category: number; // category ID
}


interface TransactionsState {
  transactions: Transaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  addTransactionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  addTransactionStatus: 'idle',
  status: 'idle',
  error: null,
};

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/`;

// GET: List all transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await fetch(BASE_URL, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return (await response.json()) as Transaction[];
  }
);

// POST: Add a new transaction
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (newTransaction: NewTransaction, { rejectWithValue }) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error?.error || 'Failed to add transaction');
      }

      return await response.json(); // returns full transaction object
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// PUT: Update a transaction
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, ...updatedData }: Partial<Transaction> & { id: number }) => {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return (await response.json()) as Transaction;
  }
);

// DELETE: Delete a transaction
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: number) => {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      })
      .addCase(addTransaction.pending, (state) => {
        state.addTransactionStatus = 'loading';
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.addTransactionStatus = 'succeeded';
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.addTransactionStatus = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      })

      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.transactions = state.transactions.filter(tx => tx.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;
