import { Button, Group, Loader, Modal, NumberInput, Select, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { getDoc } from 'firebase/firestore';
import { addClient, addOrder, editOrder } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiMoneyDollarCircleLine, RiUserLine } from 'react-icons/ri';
import { Client } from 'types/client';
import { Order } from 'types/order';

interface OrderFormProps {
  opened: boolean;
  closeForm: () => void;
  values?: Order;
  clients?: Client[];
}

interface InitialValues {
  clientId: string;
  price: number | null;
}

const MAX_PRICE = 999999999;

export default function OrderForm({ opened, closeForm, values, clients }: OrderFormProps) {
  const form = useForm({
    initialValues: {
      clientId: '',
      price: null,
    } as InitialValues,
    validate: {
      clientId: (value) => (value ? null : 'Invalid client'),
      price: (value) => {
        if (value == null) {
          return 'Invalid price';
        }
        if (value < 0) {
          return 'Price cannot be less than 0';
        }
        if (value > MAX_PRICE) {
          return `Price cannot be greater than ${MAX_PRICE}`;
        }
      },
    },
  });
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      if (values) {
        form.setValues({ ...values, price: values.price === 0 ? null : values.price });
      } else {
        form.reset();
      }
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>{values ? 'Edit order' : 'Add order'}</Title>}
      size={520}
      trapFocus
      onClose={closeForm}
      target=".modal-container"
    >
      <form
        onSubmit={form.onSubmit(({ clientId, price }) => {
          closeForm();
          if (values) {
            editOrder(values.id, { clientId, price: price || 0 });
          } else {
            addOrder({
              clientId,
              price: price || 0,
              status: 'pending',
              receivedTimestamp: dayjs().valueOf(),
              deliveredTimestamp: null,
            });
          }
        })}
      >
        <Group align="flex-start" spacing="sm" grow>
          <Select
            label="Client"
            data={clients?.map((client) => ({ value: client.id, label: client.name })) ?? []}
            icon={isClientLoading ? <Loader size={16} /> : <RiUserLine />}
            placeholder={isClientLoading ? 'Loading client...' : 'Select client'}
            nothingFound="Client not found"
            initiallyOpened={false}
            maxLength={36}
            creatable
            searchable
            selectOnBlur
            data-autofocus={values ? undefined : true}
            disabled={isClientLoading}
            getCreateLabel={(query) => `+ Add client ${query}`}
            onCreate={async (query) => {
              setIsClientLoading(true);
              const newClientRef = await addClient({ name: query });
              const newClient = await getDoc(newClientRef);
              setIsClientLoading(false);
              form.setFieldValue('clientId', newClient.id);
            }}
            {...form.getInputProps('clientId')}
          />
          <NumberInput
            label="Price"
            icon={<RiMoneyDollarCircleLine />}
            placeholder="Pending"
            min={0}
            max={MAX_PRICE}
            data-autofocus
            {...form.getInputProps('price')}
          />
        </Group>
        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
}
