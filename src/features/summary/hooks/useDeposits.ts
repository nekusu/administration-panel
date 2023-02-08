import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { orderBy, query, where } from 'firebase/firestore';
import { depositsCollection, expensesCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { DatesRangeValue } from 'mantine-dates-6';
import { useMemo } from 'react';

dayjs.extend(isBetween);

export default function useDeposits(dates: DatesRangeValue) {
  const expensesQuery = query(expensesCollection, where('deductFromFunds', '==', true));
  const [expenses] = useCollectionDataPersistent(expensesQuery);
  const depositsQuery = query(depositsCollection, orderBy('date', 'desc'));
  const [deposits] = useCollectionDataPersistent(depositsQuery);

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
