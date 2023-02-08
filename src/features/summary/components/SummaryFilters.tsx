import {
  Box,
  Checkbox,
  createStyles,
  Group,
  MantineSize,
  MultiSelect,
  Stack,
  Switch,
  useMantineTheme,
} from '@mantine/core';
import { LabeledSegmentedControl, SelectItem, SelectValue } from 'components';
import { DatesRangeValue, DateValue, MonthPickerInput } from 'mantine-dates-6';
import { Dispatch, SetStateAction } from 'react';
import { RiCalendarEventLine, RiPriceTag3Line } from 'react-icons/ri';
import { Tag } from 'types/expense';
import * as Filters from 'types/filters';

interface SummaryFiltersProps {
  filters: Filters.Summary;
  setFilters(value: Partial<Filters.Summary>): void;
  tags?: Tag[];
  month: DateValue;
  setMonth: Dispatch<SetStateAction<DateValue>>;
  range: DatesRangeValue;
  setRange: (val: DatesRangeValue) => void;
}

const useStyles = createStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

const TIMEFRAME_UNITS = ['Month', 'Custom'];

export default function SummaryFilters({
  filters,
  setFilters,
  tags,
  month,
  setMonth,
  range,
  setRange,
}: SummaryFiltersProps) {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Box className={classes.grid}>
      <Stack>
        <LabeledSegmentedControl
          label="Timeframe"
          data={TIMEFRAME_UNITS.map((unit) => ({ label: unit, value: unit.toLowerCase() }))}
          value={filters.timeframe}
          onChange={(value: Filters.Summary['timeframe']) => setFilters({ timeframe: value })}
        />
        {filters.timeframe === 'month' ? (
          <MonthPickerInput icon={<RiCalendarEventLine />} value={month} onChange={setMonth} />
        ) : (
          <MonthPickerInput
            type="range"
            icon={<RiCalendarEventLine />}
            placeholder="Select range"
            clearable
            value={range}
            onChange={setRange}
          />
        )}
      </Stack>
      <Stack>
        <MultiSelect
          label="Filter by tags"
          data={tags?.map(({ id, name, color }) => ({ value: id, label: name, color })) ?? []}
          icon={<RiPriceTag3Line />}
          placeholder="Select tags"
          nothingFound="Tag not found"
          itemComponent={SelectItem}
          valueComponent={SelectValue}
          searchable
          value={filters.tags}
          onChange={(value) => setFilters({ tags: value })}
        />
        <Switch
          label="Only show expenses deducted from funds"
          checked={filters.showFundsExpenses}
          onChange={({ target: { checked } }) => setFilters({ showFundsExpenses: checked })}
          radius={theme.radius[theme.defaultRadius as MantineSize]}
          mb={-8}
          styles={{ input: { position: 'absolute' } }}
        />
        <Group>
          <Checkbox
            label="Enable left ticks"
            checked={filters.enableLeftTicks}
            onChange={({ target: { checked } }) => setFilters({ enableLeftTicks: checked })}
          />
          <Checkbox
            label="Enable labels"
            checked={filters.enableLabels}
            onChange={({ target: { checked } }) => setFilters({ enableLabels: checked })}
          />
        </Group>
      </Stack>
    </Box>
  );
}
