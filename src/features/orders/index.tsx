import { useState } from 'react';
import { MainLayout, Table } from 'components';
import { orderBy, OrderByDirection, query, where } from 'firebase/firestore';
import { clientsCollection, ordersCollection } from 'lib/firebase/collections';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { RiAddLine, RiUserSettingsLine } from 'react-icons/ri';
import { Filters } from 'types/filters';
import { Order } from 'types/order';
import { Button, Center, Loader } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { ClientList, OrderFilters, OrderForm, OrderItem } from './components';

export default function Orders() {
  const [visibleNumbers] = useLocalStorage({ key: 'visible-numbers', defaultValue: true });

  const clientsQuery = query(clientsCollection, orderBy('name', 'asc'));
  const [clients, clientsLoading] = useCollectionData(clientsQuery, { initialValue: [] });

  const [statusFilter] = useLocalStorage<Filters.Status>({
    key: 'status-filter',
    defaultValue: 'all',
  });
  const [orderByFilter] = useLocalStorage<Filters.OrderBy>({
    key: 'order-by-filter',
    defaultValue: 'receivedTimestamp',
  });
  const [directionFilter] = useLocalStorage<OrderByDirection>({
    key: 'direction-filter',
    defaultValue: 'desc',
  });
  const [clientsFilter] = useLocalStorage<string[]>({
    key: 'clients-filter',
    defaultValue: [],
  });

  const ordersQueryConstraints = [orderBy(orderByFilter, directionFilter)];
  if (statusFilter !== 'all') {
    ordersQueryConstraints.push(where('status', '==', statusFilter));
  }
  if (clientsFilter.length) {
    ordersQueryConstraints.push(where('clientId', 'in', clientsFilter));
  }
  const ordersQuery = query(ordersCollection, ...ordersQueryConstraints);
  const [orders, ordersLoading] = useCollectionData(ordersQuery, { initialValue: [] });

  const [orderFormOpened, orderFormHandler] = useDisclosure(false);
  const [clientListOpened, clientListHandler] = useDisclosure(false);
  const [formValues, setFormValues] = useState<Order>();

  return (
    <MainLayout>
      <MainLayout.Header
        title="Orders"
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
        filters={<OrderFilters clients={clients} />}
        withNumbersToggle
      />
      <MainLayout.Body>
        <OrderForm
          opened={orderFormOpened}
          closeForm={orderFormHandler.close}
          values={formValues}
          clients={clients}
        />
        <ClientList opened={clientListOpened} close={clientListHandler.close} clients={clients} />
        {clientsLoading || ordersLoading ? (
          <Center sx={{ flex: 1 }}>
            <Loader />
          </Center>
        ) : (
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
        )}
      </MainLayout.Body>
    </MainLayout>
  );
}
