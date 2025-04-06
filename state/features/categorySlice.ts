import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';

export interface Category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  addCategoryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addError: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: 'idle',
  addCategoryStatus: 'idle',
  error: null,
  addError: null,
};

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/`;

// GET: Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch(BASE_URL, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return (await response.json()) as Category[];
  }
);

// POST: Create a new category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (newCategory: { name: string; category_type: string; user_id: string }, { rejectWithValue }) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error || 'Failed to set budget');
    }

    return await response.json();
  }
);


// PUT: Update a category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name }: { id: number; name: string }) => {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update category');
    return (await response.json()) as Category;
  }
);

// DELETE: Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return id;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      })

      .addCase(createCategory.pending, (state) => {
        state.addCategoryStatus = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.addCategoryStatus = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.addError = action.payload as string || 'Unknown error';
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
