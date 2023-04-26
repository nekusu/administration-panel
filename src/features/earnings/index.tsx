import { Collapse, Stack } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';
import { Datum } from '@nivo/line';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { Load, Overview } from 'components';
import dayjs, { OpUnitType } from 'dayjs';
import { QueryConstraint, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import * as Filters from 'types/filters';
import { Order } from 'types/order';
import { EarningsFilters, LineChart } from './components';

interface EarningsProps {
  visibleNumbers: boolean;
}

export default function Earnings({ visibleNumbers }: EarningsProps) {
  const [filters, setFilters] = useLocalStorage<Filters.Earnings>({
    key: 'earnings-filters',
    defaultValue: {
      timeframe: 'week',
      excludedDays: ['0'],
      enableLeftTicks: false,
      enableBottomTicks: true,
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.Earnings>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [startTime, endTime] =
    filters.timeframe === 'custom'
      ? dateRange.map((date) => dayjs(date))
      : [dayjs().startOf(filters.timeframe as OpUnitType), dayjs()];

  const queryConstraints: QueryConstraint[] = [
    where('status', '==', 'delivered'),
    where('deliveredTimestamp', '>=', startTime.valueOf()),
  ];
  if (filters.timeframe === 'custom') {
    queryConstraints.push(where('deliveredTimestamp', '<=', endTime.endOf('day').valueOf()));
  }
  const { data: orders } = useCollection<Order>({ path: 'orders', queryConstraints });

  const { data, timeUnit, totalEarnings, orderCount } = useMemo(() => {
    const { timeframe } = filters;
    const excludedDays = filters.excludedDays.map((day) => +day);
    const data: Datum[] = [];
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
        if (timeframe === 'year' || !excludedDays.includes(date.day())) {
          dates[formatedDate] = 0;
        }
      }
      orders.forEach((order) => {
        const date = dayjs(order.deliveredTimestamp);
        const formatedDate = date.format(dateFormat);
        if (!excludedDays.includes(date.day())) {
          dates[formatedDate] += order.price;
          orderCount++;
        }
      });
      Object.entries(dates).forEach(([date, value]) => {
        data.push({ x: date, y: value });
        totalEarnings += value;
      });
    }

    return { data, timeUnit, totalEarnings, orderCount };
  }, [filters.excludedDays, orders]);

  return (
    <Stack>
      <Load in={!!orders} style={{ minHeight: 336 }}>
        <Stack spacing={0}>
          <Overview
            items={[
              {
                text: visibleNumbers ? `$${totalEarnings.toLocaleString()}` : '*****',
                sub: 'Total',
              },
              { text: orderCount, sub: 'Orders' },
            ]}
          />
          <Collapse in={visibleNumbers && data.length > 1}>
            <LineChart
              data={[{ id: 'Earnings', data }]}
              timeUnit={timeUnit}
              enableLeftTicks={filters.enableLeftTicks}
              enableBottomTicks={filters.enableBottomTicks}
            />
          </Collapse>
        </Stack>
      </Load>
      <EarningsFilters
        filters={filters}
        updateFilter={updateFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </Stack>
  );
}
