import { QuantityInput, Table } from 'components';
import { deleteStockItem, editStockItem } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiCheckLine, RiDeleteBin7Line } from 'react-icons/ri';
import tinycolor from 'tinycolor2';
import { Stock } from 'types/stock';
import {
  ActionIcon,
  ColorSwatch,
  Group,
  Popover,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { MultiFormatColorInput } from './';

interface StockItemProps {
  item: Stock.Item;
  activeGroup?: Stock.Group;
}

export default function Item({ item, activeGroup }: StockItemProps) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { color: '' },
    validate: {
      color: (value) => {
        const color = tinycolor(value);
        if (!(value && ['hex', 'rgb', 'hsl'].includes(color.getFormat()))) {
          return 'Invalid color';
        }
      },
    },
  });
  const [colorPopoverOpened, colorPopoverHandler] = useDisclosure(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [debouncedQuantity, cancel] = useDebouncedValue(quantity, 500);

  useEffect(() => {
    if (colorPopoverOpened) {
      console.log(item.color);
      form.reset();
      if (item.color) {
        form.setFieldValue('color', item.color);
      }
    }
  }, [colorPopoverOpened]);
  useEffect(() => {
    cancel();
    setQuantity(item.quantity);
  }, [item.quantity]);
  useEffect(() => {
    if (activeGroup && item.quantity !== debouncedQuantity) {
      editStockItem(activeGroup.id, item.id, { quantity: debouncedQuantity });
    }
  }, [debouncedQuantity]);

  const openDeleteModal = () =>
    openConfirmModal({
      title: <Title order={5}>Are you sure you want to delete this item?</Title>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => {
        if (activeGroup) {
          deleteStockItem(activeGroup.id, item.id);
        }
      },
      confirmProps: { color: 'red' },
      centered: true,
      target: '.modal-container',
    });

  return (
    <Table.Row layoutId={item.id}>
      <td>
        <Popover
          position="right"
          trapFocus
          opened={colorPopoverOpened}
          onChange={colorPopoverHandler.toggle}
        >
          <Popover.Target>
            <ColorSwatch
              color={item.color}
              onClick={colorPopoverHandler.open}
              sx={{ cursor: 'pointer', zIndex: 0 }}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={form.onSubmit(({ color }) => {
                if (activeGroup) {
                  colorPopoverHandler.close();
                  editStockItem(activeGroup.id, item.id, { color });
                }
              })}
            >
              <Group spacing="sm" align="flex-start">
                <MultiFormatColorInput withinPortal={false} {...form.getInputProps('color')} />
                <ActionIcon variant="filled" color={theme.primaryColor} my={1} type="submit">
                  <RiCheckLine />
                </ActionIcon>
              </Group>
            </form>
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>{item.code}</td>
      <td>
        <QuantityInput
          min={0}
          max={999999}
          value={quantity}
          onChange={(value) => setQuantity(value ?? 0)}
        />
      </td>
      <td>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={openDeleteModal}>
            <RiDeleteBin7Line />
          </ActionIcon>
        </Tooltip>
      </td>
    </Table.Row>
  );
}
