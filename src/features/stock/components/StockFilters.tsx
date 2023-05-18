import { Group, Text, TextInput } from '@mantine/core';
import { LabeledSegmentedControl } from 'components';
import { useFilters } from 'context/filters';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiHashtag,
  RiNumbersLine,
  RiSearchLine,
} from 'react-icons/ri';
import { Stock } from 'types/filters';

interface StockFilters {
  setSearchValue(value: string): void;
}

export default function StockFilters({ setSearchValue }: StockFilters) {
  const { stock: filters, setFilters } = useFilters();

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
        onChange={(value: Stock['orderBy']) =>
          setFilters((draft) => void (draft.stock.orderBy = value))
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
        onChange={(value: Stock['direction']) =>
          setFilters((draft) => void (draft.stock.direction = value))
        }
      />
    </>
  );
}
