import { Group, MultiSelect, Text } from '@mantine/core';
import { LabeledSegmentedControl, SelectItem, SelectValue } from 'components';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
} from 'react-icons/ri';
import { Tag } from 'types/expense';
import * as Filters from 'types/filters';

interface ExpenseFiltersProps {
  tags?: Tag[];
  filters: Filters.Expense;
  updateFilter(value: Partial<Filters.Expense>): void;
}

export default function ExpenseFilters({ tags, filters, updateFilter }: ExpenseFiltersProps) {
  return (
    <>
      <LabeledSegmentedControl
        label="Order by"
        data={[
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiMoneyDollarCircleLine />
                <Text>Amount</Text>
              </Group>
            ),
            value: 'amount',
          },
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiCalendarEventLine />
                <Text>Date</Text>
              </Group>
            ),
            value: 'date',
          },
        ]}
        value={filters.orderBy}
        onChange={(value: Filters.Expense['orderBy']) => updateFilter({ orderBy: value })}
      />
      <LabeledSegmentedControl
        label="Direction"
        data={[
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiArrowUpLine />
                <Text>Ascending</Text>
              </Group>
            ),
            value: 'asc',
          },
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiArrowDownLine />
                <Text>Descending</Text>
              </Group>
            ),
            value: 'desc',
          },
        ]}
        value={filters.direction}
        onChange={(value: Filters.Expense['direction']) => updateFilter({ direction: value })}
      />
      <MultiSelect
        label="Filter by tags"
        data={tags?.map(({ id, name, color }) => ({ value: id, label: name, color })) ?? []}
        icon={<RiPriceTag3Line />}
        placeholder="Select tags"
        nothingFound="Tag not found"
        itemComponent={SelectItem}
        valueComponent={SelectValue}
        maxLength={18}
        searchable
        value={filters.tags}
        onChange={(value) => updateFilter({ tags: value })}
      />
    </>
  );
}
