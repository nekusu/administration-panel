import {
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useGlobal } from 'context/global';
import { getDoc } from 'firebase/firestore';
import { addStockGroup, addStockItem } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiFolder3Line, RiHashtag, RiNumbersLine } from 'react-icons/ri';
import tinycolor from 'tinycolor2';
import * as Stock from 'types/stock';
import { z } from 'zod';
import { MultiFormatColorInput } from './';

interface StockItemFormProps {
  opened: boolean;
  closeForm(): void;
  groups?: Stock.Group[];
}

interface FormValues {
  stockGroupId: string;
  code: string;
  quantity: number;
  color: string;
}

const MAX_CODE_LENGTH = 20;
const MAX_QUANTITY = 1000000;
const schema = z.object({
  stockGroupId: z.string({ invalid_type_error: 'Required' }).trim().min(1, { message: 'Required' }),
  code: z.string().trim().min(1, { message: 'Required' }).max(MAX_CODE_LENGTH),
  quantity: z.number({ invalid_type_error: 'Required' }).min(0).max(MAX_QUANTITY),
  color: z
    .string()
    .refine((value) => !value || ['hex', 'rgb', 'hsl'].includes(tinycolor(value).getFormat()), {
      message: 'Invalid color',
    }),
});

export default function StockItemForm({ opened, closeForm, groups }: StockItemFormProps) {
  const { activeGroup, setGlobal } = useGlobal();
  const form = useForm<FormValues>({
    initialValues: {
      stockGroupId: '',
      code: '',
      quantity: 0,
      color: '',
    },
    validate: zodResolver(schema),
  });
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      form.reset();
      if (activeGroup) {
        form.setValues({ stockGroupId: activeGroup.id });
      }
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title="Add item"
      size={520}
      trapFocus
      onClose={closeForm}
      target=".modal-container"
    >
      <form
        onSubmit={form.onSubmit(({ stockGroupId, ...data }) => {
          closeForm();
          addStockItem(stockGroupId, schema.omit({ stockGroupId: true }).parse(data));
        })}
      >
        <SimpleGrid cols={2} spacing="sm">
          <Select
            label="Group"
            data={groups?.map(({ id, name }) => ({ value: id, label: name })) ?? []}
            icon={isGroupLoading ? <Loader size={16} /> : <RiFolder3Line />}
            placeholder={isGroupLoading ? 'Loading group...' : 'Select group'}
            nothingFound="Group not found"
            initiallyOpened={false}
            maxLength={36}
            creatable
            searchable
            selectOnBlur
            data-autofocus={groups?.length && activeGroup ? undefined : true}
            disabled={isGroupLoading}
            getCreateLabel={(query) => `+ Add group ${query}`}
            onCreate={(query) => {
              setIsGroupLoading(true);
              addStockGroup({ name: query })
                .then((newGroupRef) => getDoc(newGroupRef))
                .then((newGroup) => {
                  setIsGroupLoading(false);
                  setGlobal((draft) => void (draft.activeGroup = { id: newGroup.id, name: query }));
                  form.setFieldValue('stockGroupId', newGroup.id);
                });
              return null;
            }}
            {...form.getInputProps('stockGroupId')}
          />
          <TextInput
            label="Code"
            icon={<RiHashtag />}
            placeholder="Enter code"
            maxLength={MAX_CODE_LENGTH}
            data-autofocus
            {...form.getInputProps('code')}
          />
          <NumberInput
            label="Quantity"
            icon={<RiNumbersLine />}
            placeholder="Enter quantity"
            min={0}
            max={MAX_QUANTITY}
            {...form.getInputProps('quantity')}
          />
          <MultiFormatColorInput
            label="Color"
            menuPosition="right"
            {...form.getInputProps('color')}
          />
        </SimpleGrid>
        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
}
