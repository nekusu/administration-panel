import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Stack,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { DatesRangeValue, DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Load, Overview } from 'components';
import { orderBy, query } from 'firebase/firestore';
import { tagsCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { useState } from 'react';
import { RiHistoryLine, RiInboxArchiveLine } from 'react-icons/ri';
import { BarChart, DepositForm, DepositHistory, NetEarnings, SummaryFilters } from './components';
import useChartData from './hooks/useChartData';
import useDeposits from './hooks/useDeposits';
import useExpenses from './hooks/useExpenses';
import useFilters from './hooks/useFilters';

interface SummaryProps {
  visibleNumbers: boolean;
}

export default function Summary({ visibleNumbers }: SummaryProps) {
  const theme = useMantineTheme();
  const [filters, setFilters] = useFilters();
  const [month, setMonth] = useState<DateValue>(new Date());
  const [range, setRange] = useState<DatesRangeValue>([null, null]);
  const dates = filters.timeframe === 'month' ? ([month, month] as DatesRangeValue) : range;
  const [tags] = useCollectionDataPersistent(query(tagsCollection, orderBy('name', 'asc')));
  const { expenses, total } = useExpenses(dates, filters);
  const { deposits, deposited, remainingFunds } = useDeposits(dates);
  const chartData = useChartData(dates, filters.tags, tags, expenses, deposits);
  const [depositFormOpened, depositFormHandler] = useDisclosure(false);
  const [depositHistoryOpened, depositHistoryHandler] = useDisclosure(false);
  const [netEarningsOpened, netEarningsHandler] = useDisclosure(false);

  return (
    <Stack>
      <Load in={!!(tags && expenses && deposits)} style={{ minHeight: 336 }}>
        <Stack spacing={0}>
          <Overview
            items={[
              {
                text: visibleNumbers ? `$${total.toLocaleString()}` : '*****',
                sub: 'Expenses',
              },
              {
                text: visibleNumbers ? `$${deposited.toLocaleString()}` : '*****',
                sub: 'Deposited',
              },
              {
                text: visibleNumbers ? `$${remainingFunds.toLocaleString()}` : '*****',
                sub: 'Remaining funds',
              },
            ]}
          />
          <Collapse in={visibleNumbers && dates.every((date) => !!date)}>
            <BarChart
              timeframe={filters.timeframe}
              enableLeftTicks={filters.enableLeftTicks}
              enableLabels={filters.enableLabels}
              {...chartData}
            />
          </Collapse>
        </Stack>
      </Load>
      <Group position="apart">
        <Group spacing={6}>
          <Button
            variant="light"
            leftIcon={<RiInboxArchiveLine />}
            onClick={depositFormHandler.open}
          >
            Deposit
          </Button>
          <Button variant="subtle" onClick={netEarningsHandler.open}>
            Net earnings
          </Button>
        </Group>
        <Tooltip label="Deposit history">
          <ActionIcon
            variant="subtle"
            color={theme.primaryColor}
            onClick={depositHistoryHandler.open}
          >
            <RiHistoryLine />
          </ActionIcon>
        </Tooltip>
      </Group>
      <DepositForm opened={depositFormOpened} close={depositFormHandler.close} />
      <NetEarnings opened={netEarningsOpened} close={netEarningsHandler.close} />
      <DepositHistory
        opened={depositHistoryOpened}
        close={depositHistoryHandler.close}
        deposits={deposits}
      />
      <SummaryFilters
        filters={filters}
        setFilters={setFilters}
        tags={tags}
        month={month}
        setMonth={setMonth}
        range={range}
        setRange={setRange}
      />
    </Stack>
  );
}
