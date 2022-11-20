import { ListManager, Load, MainLayout, Table } from 'components';
import { orderBy, query, where } from 'firebase/firestore';
import { clientsCollection, ordersCollection } from 'lib/firebase/collections';
import { addClient } from 'lib/firebase/utils';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { useState } from 'react';
import { RiAddLine, RiUserSettingsLine } from 'react-icons/ri';
import { Filters } from 'types/filters';
import { Order } from 'types/order';
import { Button } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { OrderFilters, OrderForm, OrderItem } from './components';

interface OrdersPageProps {
  visibleNumbers: boolean;
}

export default function OrdersPage({ visibleNumbers }: OrdersPageProps) {
  const clientsQuery = query(clientsCollection, orderBy('name', 'asc'));
  const [clients, clientsLoading] = useCollectionDataPersistent(clientsQuery);

  const [filters, setFilters] = useLocalStorage<Filters.Order>({
    key: 'order-filters',
    defaultValue: {
      status: 'all',
      orderBy: 'receivedTimestamp',
      direction: 'desc',
      clients: [],
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.Order>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

  const ordersQueryConstraints = [orderBy(filters.orderBy, filters.direction)];
  if (filters.status !== 'all') {
    ordersQueryConstraints.push(where('status', '==', filters.status));
  }
  if (filters.clients.length) {
    ordersQueryConstraints.push(where('clientId', 'in', filters.clients));
  }
  const ordersQuery = query(ordersCollection, ...ordersQueryConstraints);
  const [orders, ordersLoading] = useCollectionDataPersistent(ordersQuery);

  const [orderFormOpened, orderFormHandler] = useDisclosure(false);
  const [clientListOpened, clientListHandler] = useDisclosure(false);
  const [formValues, setFormValues] = useState<Order>();

  return (
    <MainLayout>
      <MainLayout.Header
        title="Orders"
        loading={clientsLoading || ordersLoading}
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
        filters={<OrderFilters clients={clients} filters={filters} updateFilter={updateFilter} />}
        withNumbersToggle
      />
      <MainLayout.Body>
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
        </Load>
      </MainLayout.Body>
    </MainLayout>
  );
}
