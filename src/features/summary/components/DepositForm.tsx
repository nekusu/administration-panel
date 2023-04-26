import { Button, Group, Modal, NumberInput, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import dayjs from 'dayjs';
import { addDeposit } from 'lib/firebase/utils';
import { useEffect } from 'react';
import { RiCalendarEventLine } from 'react-icons/ri';
import { z } from 'zod';

interface DepositFormProps {
  opened: boolean;
  close: () => void;
}

interface FormValues {
  amount: number;
  date: Date;
}

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000000;
const schema = z.object({
  amount: z.number().min(MIN_AMOUNT).max(MAX_AMOUNT),
  date: z.date(),
});

export default function DepositForm({ opened, close }: DepositFormProps) {
  const form = useForm<FormValues>({
    initialValues: { amount: 0, date: new Date() },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (opened) form.reset();
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>Deposit</Title>}
      size={440}
      trapFocus
      onClose={close}
      target=".side-panel"
    >
      <form
        onSubmit={form.onSubmit((data) => {
          close();

          const parsedData = schema.parse(data);
          const date = dayjs(parsedData.date).format('YYYY-MM-DD');
          addDeposit({ ...parsedData, date });
        })}
      >
        <Group align="flex-start" spacing="sm" grow>
          <NumberInput
            label="Amount"
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
              value && !Number.isNaN(+value)
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '$ '
            }
            placeholder="Enter amount"
            min={0}
            max={MAX_AMOUNT}
            precision={2}
            data-autofocus
            {...form.getInputProps('amount')}
          />
          <DatePickerInput
            label="Date"
            icon={<RiCalendarEventLine />}
            placeholder="Pick date"
            {...form.getInputProps('date')}
          />
        </Group>
        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
}
