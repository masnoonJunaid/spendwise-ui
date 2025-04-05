import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { authReducer } from './features/authSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
