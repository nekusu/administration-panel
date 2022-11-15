import {
  createStyles,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';

interface EarningsOverviewProps {
  visibleNumbers: boolean;
  totalEarnings: number;
  orderCount: number;
}

const useStyles = createStyles((theme) => ({
  container: {
    cursor: 'default',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
  },
}));

export default function EarningsOverview({
  visibleNumbers,
  totalEarnings,
  orderCount,
}: EarningsOverviewProps) {
  const { classes } = useStyles();

  return (
    <Paper p="xs" className={classes.container}>
      <Group>
        <Stack p={4} spacing={8} align="center" sx={{ flex: 1 }}>
          <Text size={26} weight="bold" inline>
            {visibleNumbers ? `$${totalEarnings.toLocaleString()}` : '*****'}
          </Text>
          <Text size="sm" weight="bold" color="dimmed" inline>
            Total
          </Text>
        </Stack>
        <Divider orientation="vertical" />
        <Stack p={4} spacing={8} align="center" sx={{ flex: 1 }}>
          <Text size={26} weight="bold" inline>
            {orderCount}
          </Text>
          <Text size="sm" weight="bold" color="dimmed" inline>
            Orders
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
