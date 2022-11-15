import { useMemo, useState } from 'react';
import dayjs, { OpUnitType } from 'dayjs';
import { query, where } from 'firebase/firestore';
import { ordersCollection } from 'lib/firebase/collections';
import {
  useCollectionDataPersistent,
} from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { Filters } from 'types/filters';
import { Center, Collapse, Loader, Stack } from '@mantine/core';
import { DateRangePickerValue } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';
import { Datum } from '@nivo/line';
import { EarningsFilters, EarningsOverview, LineChart } from './components';

export default function Earnings() {
  const [visibleNumbers] = useLocalStorage({ key: 'visible-numbers', defaultValue: true });

  const [timeframe] = useLocalStorage<Filters.Timeframe>({
    key: 'timeframe-filter',
    defaultValue: 'year',
  });
  const [excludedDays] = useLocalStorage<string[]>({
    key: 'excluded-days-filter',
    defaultValue: [],
  });
  const [showLeftTicks] = useLocalStorage({ key: 'show-left-ticks', defaultValue: true });
  const [showBottomTicks] = useLocalStorage({ key: 'show-bottom-ticks', defaultValue: false });

  const [dateRange, setDateRange] = useState<DateRangePickerValue>([null, null]);
  const [startTime, endTime] =
    timeframe === 'custom'
      ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
      : [dayjs().startOf(timeframe as OpUnitType), dayjs()];

  const ordersQueryConstraints = [
    where('status', '==', 'delivered'),
    where('deliveredTimestamp', '>=', startTime.valueOf()),
  ];
  if (timeframe === 'custom') {
    ordersQueryConstraints.push(where('deliveredTimestamp', '<=', endTime.endOf('day').valueOf()));
  }
  const ordersQuery = query(ordersCollection, ...ordersQueryConstraints);
  const [orders] = useCollectionDataPersistent(ordersQuery);

  const { data, timeUnit, totalEarnings, orderCount } = useMemo(() => {
    const excludedDaysNumbers = excludedDays.map((day) => +day);
    let data: Datum[] = [];
    let timeUnit: 'day' | 'month' = 'day';
    let totalEarnings = 0;
    let orderCount = 0;

    if (orders) {
      const dates: Record<string, number> = {};
      const dateFormat = timeframe === 'year' ? 'MMM' : 'YYYY-MM-DD';
      timeUnit = timeframe === 'year' ? 'month' : 'day';

      for (let i = 0; i <= endTime.diff(startTime, timeUnit); i++) {
        const date = startTime.add(i, timeUnit);
        const formatedDate = date.format(dateFormat);
        if (timeframe === 'year' || !excludedDaysNumbers.includes(date.day())) {
          dates[formatedDate] = 0;
        }
      }
      orders.forEach((order) => {
        const date = dayjs(order.deliveredTimestamp);
        const formatedDate = date.format(dateFormat);
        if (!excludedDaysNumbers.includes(date.day())) {
          dates[formatedDate] += order.price;
          orderCount++;
        }
      });
      data = Object.entries(dates).reduce((data, [date, value]) => {
        data.push({ x: date, y: value });
        totalEarnings += value;
        return data;
      }, [] as Datum[]);
    }

    return { data, timeUnit, totalEarnings, orderCount };
  }, [excludedDays, orders]);

  return (
    <Stack>
      {orders ? (
        <Stack spacing={0}>
          <EarningsOverview
            visibleNumbers={visibleNumbers}
            totalEarnings={totalEarnings}
            orderCount={orderCount}
          />
          <Collapse in={visibleNumbers && data.length > 1}>
            <LineChart
              data={[{ id: 'Earnings', data }]}
              timeUnit={timeUnit}
              showLeftTicks={showLeftTicks}
              showBottomTicks={showBottomTicks}
            />
          </Collapse>
        </Stack>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
      <EarningsFilters dateRange={dateRange} setDateRange={setDateRange} />
    </Stack>
  );
}
