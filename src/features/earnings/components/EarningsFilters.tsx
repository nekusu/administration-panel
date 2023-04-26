import { Box, Checkbox, Collapse, createStyles, Group, MultiSelect, Stack } from '@mantine/core';
import { DatePickerInput, DatesRangeValue, getWeekdayNames } from '@mantine/dates';
import { LabeledSegmentedControl } from 'components';
import { Dispatch, SetStateAction } from 'react';
import { RiCalendar2Line, RiCalendarEventLine } from 'react-icons/ri';
import * as Filters from 'types/filters';

interface EarningsFiltersProps {
  filters: Filters.Earnings;
  updateFilter(value: Partial<Filters.Earnings>): void;
  dateRange: DatesRangeValue;
  setDateRange: Dispatch<SetStateAction<DatesRangeValue>>;
}

const useStyles = createStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

const TIMEFRAME_UNITS = ['Week', 'Month', 'Year', 'Custom'];

export default function EarningsFilters({
  filters,
  updateFilter,
  dateRange,
  setDateRange,
}: EarningsFiltersProps) {
  const { classes } = useStyles();

  return (
    <Box className={classes.grid}>
      <Stack spacing={0}>
        <LabeledSegmentedControl
          label="Timeframe"
          data={TIMEFRAME_UNITS.map((unit) => ({ label: unit, value: unit.toLowerCase() }))}
          value={filters.timeframe}
          onChange={(value: Filters.Earnings['timeframe']) => updateFilter({ timeframe: value })}
        />
        <Collapse in={filters.timeframe === 'custom'}>
          <DatePickerInput
            type="range"
            icon={<RiCalendar2Line />}
            placeholder="Select dates range"
            firstDayOfWeek={0}
            defaultLevel="year"
            clearable
            pt="md"
            value={dateRange}
            onChange={setDateRange}
          />
        </Collapse>
      </Stack>
      <Stack>
        <MultiSelect
          label="Exclude"
          data={getWeekdayNames({ locale: 'en', format: 'dddd', firstDayOfWeek: 0 }).map(
            (day, index) => ({
              label: day,
              value: index.toString(),
            })
          )}
          icon={<RiCalendarEventLine />}
          placeholder="Select days"
          value={filters.excludedDays}
          onChange={(value) => updateFilter({ excludedDays: value })}
        />
        <Group>
          <Checkbox
            checked={filters.enableLeftTicks}
            label="Enable left ticks"
            onChange={({ target: { checked } }) => updateFilter({ enableLeftTicks: checked })}
          />
          <Checkbox
            checked={filters.enableBottomTicks}
            label="Enable bottom ticks"
            onChange={({ target: { checked } }) => updateFilter({ enableBottomTicks: checked })}
          />
        </Group>
      </Stack>
    </Box>
  );
}
