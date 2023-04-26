import { DatesRangeValue } from '@mantine/dates';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useMemo } from 'react';
import { Deposit, Expense } from 'types/expense';

dayjs.extend(isBetween);

export default function useDeposits(dates: DatesRangeValue) {
  const { data: expenses } = useCollection<Expense>({
    path: 'expenses',
    where: [['deductFromFunds', '==', true]],
  });
  const { data: deposits } = useCollection<Deposit>({
    path: 'deposits',
    orderBy: [['date', 'desc']],
  });

  const deposited = useMemo(() => {
    let deposited = 0;
    if (deposits && dates.every((date) => !!date)) {
      deposits.forEach((deposit) => {
        if (dayjs(deposit.date).isBetween(dates[0], dates[1], 'month', '[]')) {
          deposited += deposit.amount;
        }
      });
    }
    return deposited;
  }, [dates, deposits]);
  const remainingFunds = useMemo(() => {
    let remainingFunds = 0;
    expenses?.forEach((expense) => (remainingFunds -= expense.amount));
    deposits?.forEach((deposit) => (remainingFunds += deposit.amount));
    return remainingFunds;
  }, [expenses, deposits]);

  return { deposits, deposited, remainingFunds };
}
