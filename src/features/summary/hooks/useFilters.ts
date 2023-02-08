import { useLocalStorage } from '@mantine/hooks';
import { Summary } from 'types/filters';

export default function useFilters() {
  const [filters, _setFilters] = useLocalStorage<Summary>({
    key: 'summary-filters',
    defaultValue: {
      timeframe: 'month',
      tags: [],
      showFundsExpenses: false,
      enableLeftTicks: true,
      enableLabels: true,
    },
    getInitialValueInEffect: false,
  });
  const setFilters = (value: Partial<Summary>) => {
    _setFilters((prevState) => ({ ...prevState, ...value }));
  };

  return [filters, setFilters] as const;
}
