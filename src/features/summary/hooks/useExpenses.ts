import { DatesRangeValue } from '@mantine/dates';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import dayjs from 'dayjs';
import { where } from 'firebase/firestore';
import { Expense } from 'types/expense';
import { Summary } from 'types/filters';

export default function useExpenses(dates: DatesRangeValue, filters: Summary) {
  const queryConstraints = [where('deductFromFunds', '==', filters.showFundsExpenses)];
  if (dates.every((date) => !!date)) {
    queryConstraints.push(
      where('date', '>=', dayjs(dates[0]).startOf('month').format('YYYY-MM-DD')),
      where('date', '<=', dayjs(dates[1]).endOf('month').format('YYYY-MM-DD'))
    );
  }
  if (filters.tags.length) {
    queryConstraints.push(where('tagIds', 'array-contains-any', filters.tags));
  }
  const { data: expenses } = useCollection<Expense>({ path: 'expenses', queryConstraints });
  const total = expenses?.reduce((total, expense) => total + expense.amount, 0) ?? 0;

  return { expenses, total };
}
