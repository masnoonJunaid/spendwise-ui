// components/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '../state/store';

import { ReactNode } from 'react';

export default function StoreProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
