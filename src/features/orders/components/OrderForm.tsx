import { Button, Group, Loader, Modal, NumberInput, Select, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import dayjs from 'dayjs';
import { getDoc } from 'firebase/firestore';
import { addClient, addOrder, editOrder } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiUserLine } from 'react-icons/ri';
import { Client } from 'types/client';
import { Order } from 'types/order';
import { z } from 'zod';

interface OrderFormProps {
  opened: boolean;
  closeForm: () => void;
  values?: Order;
  clients?: Client[];
}

interface FormValues {
  clientId: string;
  price?: number;
}

const MAX_PRICE = 1000000;
const schema = z.object({
  clientId: z.string({ invalid_type_error: 'Required' }).trim().min(1, { message: 'Required' }),
  price: z.number().min(0).max(MAX_PRICE).optional().default(0),
});

export default function OrderForm({ opened, closeForm, values, clients }: OrderFormProps) {
  const form = useForm<FormValues>({
    initialValues: { clientId: '' },
    validate: zodResolver(schema),
  });
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      if (values) {
        form.setValues({ ...values, price: values.price || undefined });
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
        onSubmit={form.onSubmit((data) => {
          closeForm();
          if (values) {
            editOrder(values.id, schema.parse(data));
          } else {
            addOrder({
              ...schema.parse(data),
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
            onCreate={(query) => {
              setIsClientLoading(true);
              addClient({ name: query })
                .then((newClientRef) => getDoc(newClientRef))
                .then((newClient) => {
                  setIsClientLoading(false);
                  form.setFieldValue('clientId', newClient.id);
                });
              return null;
            }}
            {...form.getInputProps('clientId')}
          />
          <NumberInput
            label="Price"
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
              value && !Number.isNaN(+value)
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '$ '
            }
            placeholder="Pending"
            min={0}
            max={MAX_PRICE}
            precision={2}
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
