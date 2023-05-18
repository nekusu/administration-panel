import useImmerLocalStorage from 'hooks/useImmerLocalStorage';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import { Earnings, Expense, Order, Stock, StockGroup, Summary } from 'types/filters';
import { Updater } from 'use-immer';

export interface Filters {
  order: Order;
  earnings: Earnings;
  stock: Stock;
  stockGroup: StockGroup;
  expense: Expense;
  summary: Summary;
}

export interface FiltersContext extends Filters {
  setFilters: Updater<Filters>;
}

export const FiltersContext = createContext<FiltersContext | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useImmerLocalStorage<Filters>({
    key: 'filters',
    defaultValue: {
      order: {
        status: 'pending',
        orderBy: 'receivedTimestamp',
        direction: 'desc',
        clients: [],
        lastValues: {},
      },
      earnings: {
        timeframe: 'week',
        excludedDays: ['0'],
        enableLeftTicks: false,
        enableBottomTicks: true,
      },
      stock: {
        orderBy: 'code',
        direction: 'asc',
      },
      stockGroup: {
        enabledMarkers: [],
        enableLeftTicks: false,
        enableLabels: true,
      },
      expense: {
        orderBy: 'date',
        direction: 'desc',
        tags: [],
      },
      summary: {
        timeframe: 'month',
        tags: [],
        showFundsExpenses: false,
        enableLeftTicks: true,
        enableLabels: true,
      },
    },
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    const { status, orderBy, direction } = filters.order;
    setFilters((draft) => void (draft.order.lastValues[status] = { orderBy, direction }));
  }, [filters.order.orderBy, filters.order.direction]);
  useEffect(() => {
    const { status, lastValues } = filters.order;
    setFilters((draft) => {
      draft.order.orderBy = lastValues[status]?.orderBy ?? draft.order.orderBy;
      draft.order.direction = lastValues[status]?.direction ?? draft.order.direction;
    });
  }, [filters.order.status]);

  return (
    <FiltersContext.Provider value={{ ...filters, setFilters }}>{children}</FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) throw new Error('useFilters must be used within a FiltersProvider');
  return context;
}
