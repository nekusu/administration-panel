import { Divider, Group, Modal, Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { Load } from 'components';
import dayjs from 'dayjs';
import { query, where } from 'firebase/firestore';
import { depositsCollection, expensesCollection, ordersCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { DateValue, MonthPickerInput } from 'mantine-dates-6';
import { useState } from 'react';
import { RiCalendarEventLine } from 'react-icons/ri';

interface NetEarningsProps {
  opened: boolean;
  close: () => void;
}

export default function NetEarnings({ opened, close }: NetEarningsProps) {
  const theme = useMantineTheme();
  const [month, setMonth] = useState<DateValue>(new Date());
  const commonQueryConstraints = [
    where('date', '>=', dayjs(month).startOf('month').format('YYYY-MM-DD')),
    where('date', '<=', dayjs(month).endOf('month').format('YYYY-MM-DD')),
  ];
  const expensesQuery = query(expensesCollection, ...commonQueryConstraints);
  const [expenses, expensesLoading] = useCollectionDataPersistent(expensesQuery);
  const depositsQuery = query(depositsCollection, ...commonQueryConstraints);
  const [deposits, depositsLoading] = useCollectionDataPersistent(depositsQuery);
  const ordersQueryConstraints = [
    where('status', '==', 'delivered'),
    where('deliveredTimestamp', '>=', dayjs(month).startOf('month').valueOf()),
    where('deliveredTimestamp', '<=', dayjs(month).endOf('month').valueOf()),
  ];
  const ordersQuery = query(ordersCollection, ...ordersQueryConstraints);
  const [orders, ordersLoading] = useCollectionDataPersistent(ordersQuery);
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
      title={<Title order={5}>Net earnings</Title>}
      size={440}
      trapFocus
      onClose={close}
      target=".side-panel"
      styles={{ overlay: { '&&': { position: 'absolute' } } }}
    >
      <Stack>
        <MonthPickerInput
          label="Month"
          icon={<RiCalendarEventLine />}
          value={month}
          onChange={setMonth}
        />
        <Load
          in={!(expensesLoading || depositsLoading || ordersLoading)}
          style={{ minHeight: 163 }}
        >
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
