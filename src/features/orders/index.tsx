import { Button, Group, Loader } from '@mantine/core';
import { useDisclosure, useIntersection } from '@mantine/hooks';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { ListManager, Load, MainLayout, Table } from 'components';
import { QueryConstraint, limit, orderBy, where } from 'firebase/firestore';
import { addClient } from 'lib/firebase/utils';
import { useEffect, useRef, useState } from 'react';
import { RiAddLine, RiUserSettingsLine } from 'react-icons/ri';
import { Client } from 'types/client';
import { Order } from 'types/order';
import { OrderFilters, OrderForm, OrderItem } from './components';
import useFilters from './hooks/useFilters';

interface OrdersPageProps {
  visibleNumbers: boolean;
}

const ORDERS_LIMIT = 20;

export default function OrdersPage({ visibleNumbers }: OrdersPageProps) {
  const [filters, setFilters] = useFilters();
  const { data: clients } = useCollection<Client>({ path: 'clients', orderBy: [['name', 'asc']] });
  const [ordersLimit, setOrdersLimit] = useState(ORDERS_LIMIT);

  const queryConstraints: QueryConstraint[] = [
    orderBy(filters.orderBy, filters.direction),
    limit(ordersLimit),
  ];
  if (filters.status !== 'all') {
    queryConstraints.push(where('status', '==', filters.status));
  }
  if (filters.clients.length) {
    queryConstraints.push(where('clientId', 'in', filters.clients));
  }
  const { data: orders } = useCollection<Order>({ path: 'orders', queryConstraints });

  const [orderFormOpened, orderFormHandler] = useDisclosure(false);
  const [clientListOpened, clientListHandler] = useDisclosure(false);
  const [formValues, setFormValues] = useState<Order>();

  const bodyRef = useRef<HTMLDivElement>();
  const { ref, entry } = useIntersection({ root: bodyRef.current, threshold: 0.5 });

  useEffect(() => {
    setOrdersLimit(ORDERS_LIMIT);
  }, [filters.status]);
  useEffect(() => {
    if (entry?.isIntersecting && !!orders) {
      setOrdersLimit((prevState) => prevState + ORDERS_LIMIT);
    }
  }, [entry?.isIntersecting]);

  return (
    <MainLayout>
      <MainLayout.Header
        title="Orders"
        loading={!clients || !orders}
        buttons={
          <>
            <Button
              leftIcon={<RiAddLine />}
              onClick={() => {
                setFormValues(undefined);
                orderFormHandler.open();
              }}
            >
              New order
            </Button>
            <Button
              variant="light"
              leftIcon={<RiUserSettingsLine />}
              onClick={clientListHandler.open}
            >
              Manage clients
            </Button>
          </>
        }
        filters={<OrderFilters clients={clients} filters={filters} setFilters={setFilters} />}
        withNumbersToggle
      />
      <MainLayout.Body ref={ref}>
        <OrderForm
          opened={orderFormOpened}
          closeForm={orderFormHandler.close}
          values={formValues}
          clients={clients}
        />
        <ListManager
          opened={clientListOpened}
          close={clientListHandler.close}
          label="client"
          items={clients}
          addItem={addClient}
        />
        <Load in={!!(clients && orders)}>
          <Table>
            <Table.Header>
              <th style={{ width: 0 }}>Status</th>
              <th>Client</th>
              <th style={{ width: 0, textAlign: 'right' }}>Price</th>
              <th style={{ width: 0, textAlign: 'center' }}>Received</th>
              <th style={{ width: 0, textAlign: 'center' }}>Delivered</th>
              <th style={{ width: 0 }} />
            </Table.Header>
            <Table.Body>
              {orders?.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  clientName={clients?.find((client) => client.id === order.clientId)?.name}
                  visibleNumbers={visibleNumbers}
                  setFormValues={setFormValues}
                  openOrderForm={orderFormHandler.open}
                />
              ))}
            </Table.Body>
          </Table>
          {orders?.length === ordersLimit && (
            <Group ref={ref} pt="xs" pb="lg" position="center">
              <Loader />
            </Group>
          )}
        </Load>
      </MainLayout.Body>
    </MainLayout>
  );
}
