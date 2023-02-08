import { useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { Order } from 'types/filters';

export default function useFilters() {
  const [filters, _setFilters] = useLocalStorage<Order>({
    key: 'order-filters',
    defaultValue: {
      status: 'all',
      orderBy: 'receivedTimestamp',
      direction: 'desc',
      clients: [],
      lastValues: {},
    },
    getInitialValueInEffect: false,
  });
  const setFilters = (value: Partial<Order>) => {
    _setFilters((prevState) => ({ ...prevState, ...value }));
  };

  useEffect(() => {
    const { status, orderBy, direction, lastValues } = filters;
    setFilters({ lastValues: { ...lastValues, [status]: { orderBy, direction } } });
  }, [filters.orderBy, filters.direction]);
  useEffect(() => {
    setFilters({ ...filters.lastValues[filters.status] });
  }, [filters.status]);

  return [filters, setFilters] as const;
}
