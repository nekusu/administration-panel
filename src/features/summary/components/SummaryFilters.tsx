import { Box, Checkbox, createStyles, Group, MultiSelect, Select } from '@mantine/core';
import { LabeledSegmentedControl, SelectItem, SelectValue } from 'components';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { Dispatch, SetStateAction } from 'react';
import { RiCalendarEventLine, RiPriceTag3Line } from 'react-icons/ri';
import { Tag } from 'types/expense';
import * as Filters from 'types/filters';

interface SummaryFiltersProps {
  filters: Filters.Summary;
  updateFilter(value: Partial<Filters.Summary>): void;
  tags?: Tag[];
  months: string[];
  selectedMonth?: string;
  setSelectedMonth: Dispatch<SetStateAction<string>>;
  years: string[];
  selectedYear?: string;
  setSelectedYear: Dispatch<SetStateAction<string>>;
}

dayjs.extend(localeData);

const useStyles = createStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

const TIMEFRAME_UNITS = ['Month', 'Year'];

export default function SummaryFilters({
  filters,
  updateFilter,
  tags,
  months,
  selectedMonth,
  setSelectedMonth,
  years,
  selectedYear,
  setSelectedYear,
}: SummaryFiltersProps) {
  const { classes } = useStyles();

  return (
    <Box className={classes.grid}>
      <Group spacing="sm" grow>
        <LabeledSegmentedControl
          label="Timeframe"
          data={TIMEFRAME_UNITS.map((unit) => ({ label: unit, value: unit.toLowerCase() }))}
          value={filters.timeframe}
          onChange={(value: Filters.Summary['timeframe']) => updateFilter({ timeframe: value })}
        />
        <Select
          label={filters.timeframe === 'month' ? 'Month' : 'Year'}
          data={
            filters.timeframe === 'month'
              ? months.map((month, index) => ({ label: dayjs.months()[index], value: month }))
              : years
          }
          icon={<RiCalendarEventLine />}
          placeholder={`Select ${filters.timeframe}`}
          value={filters.timeframe === 'month' ? selectedMonth : selectedYear}
          onChange={(value) =>
            (filters.timeframe === 'month' ? setSelectedMonth : setSelectedYear)(value ?? '')
          }
          clearable={false}
        />
      </Group>
      <MultiSelect
        label="Filter by tags"
        data={tags?.map(({ id, name, color }) => ({ value: id, label: name, color })) ?? []}
        icon={<RiPriceTag3Line />}
        placeholder="Select tags"
        nothingFound="Tag not found"
        itemComponent={SelectItem}
        valueComponent={SelectValue}
        searchable
        value={filters.showOnly}
        onChange={(value) => updateFilter({ showOnly: value })}
      />
      <Group pt={6}>
        <Checkbox
          checked={filters.enableLeftTicks}
          label="Enable left ticks"
          onChange={({ target: { checked } }) => updateFilter({ enableLeftTicks: checked })}
        />
        <Checkbox
          checked={filters.enableLabels}
          label="Enable labels"
          onChange={({ target: { checked } }) => updateFilter({ enableLabels: checked })}
        />
      </Group>
    </Box>
  );
}
