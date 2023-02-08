import dayjs from 'dayjs';
import { query, where } from 'firebase/firestore';
import { expensesCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { DatesRangeValue } from 'mantine-dates-6';
import { Summary } from 'types/filters';

export default function useExpenses(dates: DatesRangeValue, filters: Summary) {
  const expensesQueryConstraints = [where('deductFromFunds', '==', filters.showFundsExpenses)];
  if (dates.every((date) => !!date)) {
    expensesQueryConstraints.push(
      where('date', '>=', dayjs(dates[0]).startOf('month').format('YYYY-MM-DD')),
      where('date', '<=', dayjs(dates[1]).endOf('month').format('YYYY-MM-DD'))
    );
  }
  if (filters.tags.length) {
    expensesQueryConstraints.push(where('tagIds', 'array-contains-any', filters.tags));
  }
  const expensesQuery = query(expensesCollection, ...expensesQueryConstraints);
  const [expenses, loading] = useCollectionDataPersistent(expensesQuery);
  const total = expenses?.reduce((total, expense) => total + expense.amount, 0) ?? 0;

  return { expenses, loading, total };
}
