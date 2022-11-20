import {
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getDoc } from 'firebase/firestore';
import { addStockGroup, addStockItem } from 'lib/firebase/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RiFolder3Line, RiHashtag, RiNumbersLine } from 'react-icons/ri';
import tinycolor from 'tinycolor2';
import { Stock } from 'types/stock';
import { MultiFormatColorInput } from './';

interface StockItemFormProps {
  opened: boolean;
  closeForm(): void;
  stockGroups?: Stock.Group[];
  stockItems?: Stock.Item[];
  activeGroup?: Stock.Group;
  setActiveGroup: Dispatch<SetStateAction<Stock.Group | undefined>>;
}

const MAX_QUANTITY = 999999;

export default function StockItemForm({
  opened,
  closeForm,
  activeGroup,
  stockGroups,
  stockItems,
  setActiveGroup,
}: StockItemFormProps) {
  const form = useForm({
    initialValues: {
      stockGroupId: '',
      code: '',
      quantity: 0,
      color: '',
    },
    validate: {
      stockGroupId: (value) => (value ? null : 'Invalid group'),
      code: (value) => {
        if (!value) {
          return 'Invalid code';
        }
        if (stockItems?.some((stockItem) => stockItem.code === value)) {
          return 'Code already exists';
        }
      },
      quantity: (value) => {
        if (value == null) {
          return 'Invalid quantity';
        }
        if (value < 0) {
          return 'Quantity cannot be less than 0';
        }
        if (value > MAX_QUANTITY) {
          return `Quantity cannot be greater than ${MAX_QUANTITY}`;
        }
      },
      color: (value) => {
        if (!value) {
          return null;
        }
        const color = tinycolor(value);
        if (!['hex', 'rgb', 'hsl'].includes(color.getFormat())) {
          return 'Invalid color';
        }
      },
    },
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
      title={<Title order={5}>Add item</Title>}
      size={520}
      trapFocus
      onClose={closeForm}
      target=".modal-container"
    >
      <form
        onSubmit={form.onSubmit(({ stockGroupId, ...data }) => {
          closeForm();
          addStockItem(stockGroupId, data);
          console.log(data);
        })}
      >
        <SimpleGrid cols={2} spacing="sm">
          <Select
            label="Group"
            data={stockGroups?.map(({ id, name }) => ({ value: id, label: name })) ?? []}
            icon={isGroupLoading ? <Loader size={16} /> : <RiFolder3Line />}
            placeholder={isGroupLoading ? 'Loading group...' : 'Select group'}
            nothingFound="Group not found"
            initiallyOpened={false}
            maxLength={36}
            creatable
            searchable
            selectOnBlur
            data-autofocus={stockGroups?.length && activeGroup ? undefined : true}
            disabled={isGroupLoading}
            getCreateLabel={(query) => `+ Add group ${query}`}
            onCreate={async (query) => {
              setIsGroupLoading(true);
              const newGroupRef = await addStockGroup({ name: query });
              const newGroup = await getDoc(newGroupRef);
              setIsGroupLoading(false);
              setActiveGroup({ id: newGroup.id, name: query });
              form.setFieldValue('stockGroupId', newGroup.id);
            }}
            {...form.getInputProps('stockGroupId')}
          />
          <TextInput
            label="Code"
            icon={<RiHashtag />}
            placeholder="Enter code"
            maxLength={20}
            data-autofocus
            {...form.getInputProps('code')}
          />
          <NumberInput
            label="Amount"
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
