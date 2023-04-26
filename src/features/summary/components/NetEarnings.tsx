import { Divider, Group, Modal, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { DateValue, MonthPickerInput } from '@mantine/dates';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { Load } from 'components';
import dayjs from 'dayjs';
import { where } from 'firebase/firestore';
import { useState } from 'react';
import { RiCalendarEventLine } from 'react-icons/ri';
import { Deposit, Expense } from 'types/expense';
import { Order } from 'types/order';

interface NetEarningsProps {
  opened: boolean;
  close: () => void;
}

export default function NetEarnings({ opened, close }: NetEarningsProps) {
  const theme = useMantineTheme();
  const [month, setMonth] = useState<DateValue>(new Date());
  const queryConstraints = [
    where('date', '>=', dayjs(month).startOf('month').format('YYYY-MM-DD')),
    where('date', '<=', dayjs(month).endOf('month').format('YYYY-MM-DD')),
  ];
  const { data: expenses } = useCollection<Expense>({ path: 'expenses', queryConstraints });
  const { data: deposits } = useCollection<Deposit>({ path: 'deposits', queryConstraints });
  const { data: orders } = useCollection<Order>({
    path: 'orders',
    where: [
      ['status', '==', 'delivered'],
      ['deliveredTimestamp', '>=', dayjs(month).startOf('month').valueOf()],
      ['deliveredTimestamp', '<=', dayjs(month).endOf('month').valueOf()],
    ],
  });
  const totalExpenses =
    expenses?.reduce((total, expense) => {
      if (!expense.deductFromFunds) total += expense.amount;
      return total;
    }, 0) ?? 0;
  const totalDeposits = deposits?.reduce((total, deposit) => total + deposit.amount, 0) ?? 0;
  const totalEarnings = orders?.reduce((total, order) => total + order.price, 0) ?? 0;

  return (
    <Modal
      opened={opened}
      title="Net earnings"
      size={440}
      trapFocus
      onClose={close}
      target=".side-panel"
    >
      <Stack>
        <MonthPickerInput
          label="Month"
          icon={<RiCalendarEventLine />}
          value={month}
          onChange={setMonth}
        />
        <Load in={!!(expenses && deposits && orders)} style={{ minHeight: 163 }}>
          <Paper
            bg={theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]}
            py={12}
            px={16}
            withBorder
          >
            <Stack spacing="sm">
              <Group position="apart">
                <Text>Gross</Text>
                <Text weight="bold" color="dimmed">
                  ${totalEarnings.toLocaleString()}
                </Text>
              </Group>
              <Stack spacing={4}>
                <Group position="apart">
                  <Text size="sm" color="dimmed">
                    Expenses
                  </Text>
                  <Text size="sm" weight="bold" color="pink">
                    -${totalExpenses.toLocaleString()}
                  </Text>
                </Group>
                <Group position="apart">
                  <Text size="sm" color="dimmed">
                    Deposits
                  </Text>
                  <Text size="sm" weight="bold" color="pink">
                    -${totalDeposits.toLocaleString()}
                  </Text>
                </Group>
              </Stack>
              <Divider />
              <Group position="apart">
                <Text size="lg" weight="bold">
                  Net
                </Text>
                <Text size="lg" weight="bold" color="teal">
                  ${(totalEarnings - totalExpenses - totalDeposits).toLocaleString()}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Load>
      </Stack>
    </Modal>
  );
}
