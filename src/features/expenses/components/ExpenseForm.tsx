import {
  Button,
  Checkbox,
  DefaultMantineColor,
  Group,
  Loader,
  Modal,
  MultiSelect,
  NumberInput,
  Stack,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { ColorSelect, SelectItem, SelectValue } from 'components';
import dayjs from 'dayjs';
import { getDoc } from 'firebase/firestore';
import { addExpense, addTag, editExpense } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiCalendarEventLine, RiPriceTag3Line } from 'react-icons/ri';
import { Expense, Tag } from 'types/expense';
import { z } from 'zod';

interface ExpenseFormProps {
  opened: boolean;
  closeForm: () => void;
  values?: Expense;
  tags?: Tag[];
}

interface FormValues {
  tagIds: string[];
  description: string;
  amount: number;
  date: Date;
  deductFromFunds: boolean;
}

const MAX_AMOUNT = 1000000;
const schema = z.object({
  tagIds: z.array(z.string()).nonempty({ message: 'Required' }),
  description: z.string().trim().optional(),
  amount: z.number().min(0).max(MAX_AMOUNT).optional().default(0),
  date: z.date(),
  deductFromFunds: z.boolean(),
});

export default function ExpenseForm({ opened, closeForm, values, tags }: ExpenseFormProps) {
  const form = useForm<FormValues>({
    initialValues: {
      tagIds: [],
      description: '',
      amount: 0,
      date: new Date(),
      deductFromFunds: false,
    },
    validate: zodResolver(schema),
  });
  const [colorTagModalOpened, colorTagModalHandler] = useDisclosure(false);
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState<DefaultMantineColor>('red');

  useEffect(() => {
    if (opened) {
      if (values) {
        form.setValues({ ...values, date: dayjs(values.date).toDate() });
      } else {
        form.reset();
      }
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>{values ? 'Edit expense' : 'Add expense'}</Title>}
      size={520}
      trapFocus
      onClose={closeForm}
      target=".modal-container"
    >
      <form
        onSubmit={form.onSubmit((data) => {
          closeForm();

          const parsedData = schema.parse(data);
          const date = dayjs(parsedData.date).format('YYYY-MM-DD');
          if (values) {
            editExpense(values.id, { ...parsedData, date });
          } else {
            addExpense({ ...parsedData, date });
          }
        })}
      >
        <Stack align="stretch" spacing="sm">
          <MultiSelect
            label="Tags"
            data={tags?.map(({ id, name, color }) => ({ value: id, label: name, color })) ?? []}
            icon={isTagLoading ? <Loader size={16} /> : <RiPriceTag3Line />}
            placeholder={isTagLoading ? 'Loading tag...' : 'Select tags'}
            nothingFound="Tag not found"
            itemComponent={SelectItem}
            valueComponent={SelectValue}
            initiallyOpened={false}
            maxLength={18}
            creatable
            searchable
            data-autofocus={values ? undefined : true}
            disabled={isTagLoading}
            getCreateLabel={(query) => `+ Add tag ${query}`}
            onCreate={(query) => {
              setTagName(query);
              colorTagModalHandler.open();
            }}
            {...form.getInputProps('tagIds')}
          />
          <Modal
            opened={colorTagModalOpened}
            title={<Title order={5}>Select tag color</Title>}
            onClose={colorTagModalHandler.close}
            target=".modal-container"
          >
            <Stack>
              <ColorSelect value={tagColor} setValue={setTagColor} />
              <Group position="right" spacing="sm">
                <Button variant="default" onClick={colorTagModalHandler.close}>
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  onClick={async () => {
                    colorTagModalHandler.close();
                    setIsTagLoading(true);
                    const newTagRef = await addTag({ name: tagName, color: tagColor });
                    const newTag = await getDoc(newTagRef);
                    setIsTagLoading(false);
                    form.setFieldValue('tagIds', [...form.values.tagIds, newTag.id]);
                  }}
                >
                  Confirm
                </Button>
              </Group>
            </Stack>
          </Modal>
          <Textarea label="Description" {...form.getInputProps('description')} />
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
            <DatePicker
              label="Date"
              icon={<RiCalendarEventLine />}
              placeholder="Pick date"
              {...form.getInputProps('date')}
            />
          </Group>
          <Checkbox
            label="Deduct from funds"
            {...form.getInputProps('deductFromFunds', { type: 'checkbox' })}
          />
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
}
