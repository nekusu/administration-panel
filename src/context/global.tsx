import { ColorScheme, DefaultMantineColor } from '@mantine/core';
import useImmerLocalStorage from 'hooks/useImmerLocalStorage';
import { ReactNode, createContext, useCallback, useContext } from 'react';
import * as Stock from 'types/stock';
import { Updater } from 'use-immer';

export interface GlobalValues {
  activeGroup?: Stock.Group;
  colorScheme: ColorScheme;
  pageIndex: number;
  primaryColor: DefaultMantineColor;
  visibleFilters: boolean;
  visibleNumbers: boolean;
  visibleSidePanel: boolean;
}

export interface GlobalContext extends GlobalValues {
  setGlobal: Updater<GlobalValues>;
  filterNumber: (number: number) => string;
}

export const GlobalContext = createContext<GlobalContext | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [global, setGlobal] = useImmerLocalStorage<GlobalValues>({
    key: 'global',
    defaultValue: {
      colorScheme: 'dark',
      pageIndex: 0,
      primaryColor: 'teal',
      visibleFilters: true,
      visibleNumbers: true,
      visibleSidePanel: true,
    },
    getInitialValueInEffect: false,
  });
  const filterNumber = useCallback(
    (number: number) => (global.visibleNumbers ? `$${number.toLocaleString()}` : '*****'),
    [global.visibleNumbers]
  );

  return (
    <GlobalContext.Provider value={{ ...global, setGlobal, filterNumber }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within a GlobalProvider');
  return context;
}
