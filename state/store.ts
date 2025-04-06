import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { authReducer } from './features/authSlice';
import categoryReducer from './features/categorySlice';
import transactionsReducer from './features/transactionSlice';
import budgetReducer from './features/budgetSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    budget: budgetReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
