// redux/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk, SerializedError, createAction } from '@reduxjs/toolkit';


export interface IAuthState {
  authState: boolean;
}


export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Failed to login');
        }
  
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        throw error;
      }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to signup');
        }
  
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        throw error;
      }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error("Logout failed");
  
      return await response.json();
    }
  );
  
  


interface AuthState {
  user: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  authState: boolean;
  logoutStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: AuthState = {
  user: null,
  status: 'idle',
  logoutStatus: 'idle',
  error: null,
  authState: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<boolean>) {
      state.authState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.error as SerializedError).message || 'Unknown error';
      }).addCase(logout.pending, (state) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutStatus = 'succeeded';
        state.user = null; // Reset user data
        state.authState = false; // Update auth state to false
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload as string | null;
      });
  },
});

export default authSlice.reducer;



export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
