import { Group, MultiSelect, Text } from '@mantine/core';
import { LabeledSegmentedControl } from 'components';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCalendarCheckLine,
  RiCalendarTodoLine,
  RiMoneyDollarCircleLine,
  RiUserSearchLine,
} from 'react-icons/ri';
import { Client } from 'types/client';
import * as Filters from 'types/filters';

interface OrderFiltersProps {
  clients?: Client[];
  filters: Filters.Order;
  updateFilter(value: Partial<Filters.Order>): void;
}

export default function OrderFilters({ clients, filters, updateFilter }: OrderFiltersProps) {
  return (
    <>
      <LabeledSegmentedControl
        label="Status"
        data={[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Finished', value: 'finished' },
          { label: 'Delivered', value: 'delivered' },
        ]}
        value={filters.status}
        onChange={(value: Filters.Order['status']) => updateFilter({ status: value })}
      />
      <LabeledSegmentedControl
        label="Order by"
        data={[
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiMoneyDollarCircleLine />
                <Text>Price</Text>
              </Group>
            ),
            value: 'price',
          },
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiCalendarTodoLine />
                <Text>Received</Text>
              </Group>
            ),
            value: 'receivedTimestamp',
          },
          {
            label: (
              <Group spacing="xs" position="center" noWrap>
                <RiCalendarCheckLine />
                <Text>Delivered</Text>
              </Group>
            ),
            value: 'deliveredTimestamp',
          },
        ]}
        value={filters.orderBy}
        onChange={(value: Filters.Order['orderBy']) => updateFilter({ orderBy: value })}
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
        onChange={(value: Filters.Order['direction']) => updateFilter({ direction: value })}
      />
      <MultiSelect
        label="Filter by clients"
        data={clients?.map((client) => ({ value: client.id, label: client.name })) ?? []}
        icon={<RiUserSearchLine />}
        placeholder="Select clients"
        nothingFound="Client not found"
        maxLength={36}
        searchable
        value={filters.clients}
        onChange={(value) => updateFilter({ clients: value })}
      />
    </>
  );
}
