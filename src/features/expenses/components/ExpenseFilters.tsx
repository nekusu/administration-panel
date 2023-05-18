import { Group, MultiSelect, Text } from '@mantine/core';
import { LabeledSegmentedControl, SelectItem, SelectValue } from 'components';
import { useFilters } from 'context/filters';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
} from 'react-icons/ri';
import { Tag } from 'types/expense';
import { Expense } from 'types/filters';

interface ExpenseFiltersProps {
  tags?: Tag[];
}

export default function ExpenseFilters({ tags }: ExpenseFiltersProps) {
  const { expense: filters, setFilters } = useFilters();

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
        onChange={(value: Expense['orderBy']) =>
          setFilters((draft) => void (draft.expense.orderBy = value))
        }
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
        onChange={(value: Expense['direction']) =>
          setFilters((draft) => void (draft.expense.direction = value))
        }
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
        onChange={(value) => setFilters((draft) => void (draft.expense.tags = value))}
      />
    </>
  );
}
