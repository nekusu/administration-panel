import { Dispatch, SetStateAction } from 'react';
import { LabeledSegmentedControl } from 'components';
import { RiCalendar2Line, RiCalendarEventLine } from 'react-icons/ri';
import { Filters } from 'types/filters';
import {
  Box,
  Checkbox,
  Collapse,
  createStyles,
  Group,
  MultiSelect,
  Stack,
} from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';

interface EarningsFiltersProps {
  dateRange: DateRangePickerValue;
  setDateRange: Dispatch<SetStateAction<DateRangePickerValue>>;
}

const useStyles = createStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

function EarningsFilters({ dateRange, setDateRange }: EarningsFiltersProps) {
  const { classes } = useStyles();
  const [timeframe, setTimeframe] = useLocalStorage<Filters.Timeframe>({
    key: 'timeframe-filter',
    defaultValue: 'year',
  });
  const [excludedDays, setExcludedDays] = useLocalStorage<string[]>({
    key: 'excluded-days-filter',
    defaultValue: [],
  });
  const [showLeftTicks, setShowLeftTicks] = useLocalStorage({
    key: 'show-left-ticks',
    defaultValue: true,
  });
  const [showBottomTicks, setShowBottomTicks] = useLocalStorage({
    key: 'show-bottom-ticks',
    defaultValue: false,
  });

  return (
    <Box className={classes.grid}>
      <Stack spacing={0}>
        <LabeledSegmentedControl
          label="Timeframe"
          data={[
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
            { label: 'Custom', value: 'custom' },
          ]}
          value={timeframe}
          onChange={(value: Filters.Timeframe) => setTimeframe(value)}
        />
        <Collapse in={timeframe === 'custom'}>
          <DateRangePicker
            icon={<RiCalendar2Line />}
            placeholder="Select dates range"
            firstDayOfWeek="sunday"
            value={dateRange}
            onChange={setDateRange}
            pt="md"
          />
        </Collapse>
      </Stack>
      <MultiSelect
        label="Exclude"
        data={[
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
          { label: 'Tuesday', value: '2' },
          { label: 'Wednesday', value: '3' },
          { label: 'Thursday', value: '4' },
          { label: 'Friday', value: '5' },
          { label: 'Saturday', value: '6' },
        ]}
        icon={<RiCalendarEventLine />}
        placeholder="Select days"
        value={excludedDays}
        onChange={setExcludedDays}
      />
      <Group pt={6}>
        <Checkbox
          checked={showLeftTicks}
          label="Show left ticks"
          onChange={(event) => setShowLeftTicks(event.target.checked)}
        />
        <Checkbox
          checked={showBottomTicks}
          label="Show bottom ticks"
          onChange={(event) => setShowBottomTicks(event.target.checked)}
        />
      </Group>
    </Box>
  );
}

export default EarningsFilters;
