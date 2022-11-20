import { LabeledSegmentedControl } from 'components';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiHashtag,
  RiNumbersLine,
  RiSearchLine,
} from 'react-icons/ri';
import { Filters } from 'types/filters';
import { Group, Text, TextInput } from '@mantine/core';

interface StockFilters {
  setSearchValue(value: string): void;
  filters: Filters.Stock;
  updateFilter(value: Partial<Filters.Stock>): void;
}

export default function StockFilters({ setSearchValue, filters, updateFilter }: StockFilters) {
  return (
    <>
      <TextInput
        label="Search"
        icon={<RiSearchLine />}
        placeholder="Search items"
        maxLength={20}
        data-autofocus
        onChange={({ target: { value } }) => setSearchValue(value)}
      />
      <LabeledSegmentedControl
        label="Order by"
        data={[
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiHashtag />
                <Text>Code</Text>
              </Group>
            ),
            value: 'code',
          },
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiNumbersLine />
                <Text>Quantity</Text>
              </Group>
            ),
            value: 'quantity',
          },
        ]}
        value={filters.orderBy}
        onChange={(value: Filters.Stock['orderBy']) => updateFilter({ orderBy: value })}
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
        onChange={(value: Filters.Stock['direction']) => updateFilter({ direction: value })}
      />
    </>
  );
}
