import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Stack,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { DateValue, DatesRangeValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { Load, Overview } from 'components';
import { useFilters } from 'context/filters';
import { useGlobal } from 'context/global';
import { useState } from 'react';
import { RiHistoryLine, RiInboxArchiveLine } from 'react-icons/ri';
import { Tag } from 'types/expense';
import { BarChart, DepositForm, DepositHistory, NetEarnings, SummaryFilters } from './components';
import useChartData from './hooks/useChartData';
import useDeposits from './hooks/useDeposits';
import useExpenses from './hooks/useExpenses';

export default function Summary() {
  const { visibleNumbers, filterNumber } = useGlobal();
  const { summary: filters } = useFilters();
  const theme = useMantineTheme();
  const [month, setMonth] = useState<DateValue>(new Date());
  const [range, setRange] = useState<DatesRangeValue>([null, null]);
  const dates = filters.timeframe === 'month' ? ([month, month] as DatesRangeValue) : range;
  const { data: tags } = useCollection<Tag>({ path: 'tags', orderBy: [['name', 'asc']] });
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
              { text: filterNumber(total), sub: 'Expenses' },
              { text: filterNumber(deposited), sub: 'Deposited' },
              { text: filterNumber(remainingFunds), sub: 'Remaining funds' },
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
        tags={tags}
        month={month}
        setMonth={setMonth}
        range={range}
        setRange={setRange}
      />
    </Stack>
  );
}
