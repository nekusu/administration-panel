import { Collapse, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BarDatum } from '@nivo/bar';
import { Load, Overview } from 'components';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import { orderBy, query, where } from 'firebase/firestore';
import { expensesCollection, tagsCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { useMemo, useState } from 'react';
import { Filters } from 'types/filters';
import { BarChart, SummaryFilters } from './components';

interface SummaryProps {
  visibleNumbers: boolean;
}

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);

const months = dayjs.monthsShort().filter((month) => dayjs(month, 'MMM').isSameOrBefore(dayjs()));

export default function Summary({ visibleNumbers }: SummaryProps) {
  const tagsQuery = query(tagsCollection, orderBy('name', 'asc'));
  const [tags] = useCollectionDataPersistent(tagsQuery);

  const [filters, setFilters] = useLocalStorage<Filters.Summary>({
    key: 'summary-filters',
    defaultValue: {
      timeframe: 'year',
      showOnly: [],
      enableLeftTicks: true,
      enableLabels: true,
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.Summary>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMM'));
  const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));

  const expensesQueryConstraints = [];
  if (filters.showOnly.length) {
    expensesQueryConstraints.push(where('tagIds', 'array-contains-any', filters.showOnly));
  }
  const expensesQuery = query(expensesCollection, ...expensesQueryConstraints);
  const [expenses] = useCollectionDataPersistent(expensesQuery);

  const { data, keys, totalExpenses, years } = useMemo(() => {
    const data: BarDatum[] = [];
    const keys = new Set<string>();
    const years = new Set<string>();
    let totalExpenses = 0;

    if (tags && expenses) {
      for (const month of months) {
        const item: BarDatum = { month };
        for (const tag of tags) {
          let tagAmount = 0;
          for (const expense of expenses) {
            if (expense.tagIds.includes(tag.id) && dayjs(expense.date).format('MMM') === month) {
              tagAmount += expense.amount;
            }
          }

          if ((!filters.showOnly.length || filters.showOnly.includes(tag.id)) && tagAmount) {
            item[tag.name] = tagAmount;
            item[`${tag.name}Color`] = tag.color;
            keys.add(tag.name);
          }
        }
        data.push(item);
      }
      expenses.forEach((expense) => {
        years.add(dayjs(expense.date).format('YYYY'));
        totalExpenses += expense.amount;
      });
    }

    return { data, keys, totalExpenses, years };
  }, [tags, expenses]);

  return (
    <Stack>
      <Load in={!!expenses && !!tags} style={{ minHeight: 336 }}>
        <Stack spacing={0}>
          <Overview
            items={[
              {
                text: visibleNumbers ? `$${totalExpenses.toLocaleString()}` : '*****',
                sub: 'Total',
              },
            ]}
          />
          <Collapse in={visibleNumbers && !!tags?.length && !!expenses?.length}>
            <BarChart
              data={data}
              keys={[...keys]}
              timeframe={filters.timeframe}
              enableLeftTicks={filters.enableLeftTicks}
              enableLabels={filters.enableLabels}
            />
          </Collapse>
        </Stack>
      </Load>
      <SummaryFilters
        filters={filters}
        updateFilter={updateFilter}
        tags={tags}
        months={months}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        years={[...years]}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </Stack>
  );
}
