import { Badge, Group, Loader, MultiSelect, Text } from '@mantine/core';
import { LabeledSegmentedControl } from 'components';
import { useFilters } from 'context/filters';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCalendarCheckLine,
  RiCalendarTodoLine,
  RiMoneyDollarCircleLine,
  RiUserSearchLine,
} from 'react-icons/ri';
import { Client } from 'types/client';
import { Order } from 'types/filters';

interface OrderFiltersProps {
  clients?: Client[];
  pendingCount?: number;
  finishedCount?: number;
}

export default function OrderFilters({ clients, pendingCount, finishedCount }: OrderFiltersProps) {
  const { order: filters, setFilters } = useFilters();

  return (
    <>
      <LabeledSegmentedControl
        label="Status"
        data={[
          {
            label: (
              <Group spacing={8} position="center" noWrap>
                Pending
                {pendingCount ? <Badge p={6}>{pendingCount}</Badge> : <Loader size={16} />}
              </Group>
            ),
            value: 'pending',
          },
          {
            label: (
              <Group spacing={8} position="center" noWrap>
                Finished
                {finishedCount ? <Badge p={6}>{finishedCount}</Badge> : <Loader size={16} />}
              </Group>
            ),
            value: 'finished',
          },
          { label: 'Delivered', value: 'delivered' },
        ]}
        value={filters.status}
        onChange={(value: Order['status']) =>
          setFilters((draft) => void (draft.order.status = value))
        }
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
        onChange={(value: Order['orderBy']) =>
          setFilters((draft) => void (draft.order.orderBy = value))
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
        onChange={(value: Order['direction']) =>
          setFilters((draft) => void (draft.order.direction = value))
        }
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
        onChange={(value) => setFilters((draft) => void (draft.order.clients = value))}
      />
    </>
  );
}
