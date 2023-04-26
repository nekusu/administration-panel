import {
  ActionIcon,
  ColorSwatch,
  Group,
  Popover,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { QuantityInput, Table } from 'components';
import { deleteStockItem, editStockItem } from 'lib/firebase/utils';
import { useEffect, useState } from 'react';
import { RiCheckLine, RiDeleteBin7Line } from 'react-icons/ri';
import tinycolor from 'tinycolor2';
import * as Stock from 'types/stock';
import { z } from 'zod';
import { MultiFormatColorInput } from './';

interface StockItemProps {
  item: Stock.Item;
  activeGroup?: Stock.Group;
}

interface FormValues {
  color: string;
}

const schema = z.object({
  color: z
    .string()
    .refine((value) => !value || ['hex', 'rgb', 'hsl'].includes(tinycolor(value).getFormat()), {
      message: 'Invalid color',
    }),
});

export default function Item({ item, activeGroup }: StockItemProps) {
  const theme = useMantineTheme();
  const form = useForm<FormValues>({
    initialValues: { color: '' },
    validate: zodResolver(schema),
  });
  const [colorPopoverOpened, colorPopoverHandler] = useDisclosure(false);
  const [quantity, setQuantity] = useState<number | ''>(item.quantity);
  const [debouncedQuantity, cancel] = useDebouncedValue(quantity, 500);

  useEffect(() => {
    if (colorPopoverOpened) {
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
      editStockItem(activeGroup.id, item.id, { quantity: debouncedQuantity || 0 });
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
          withinPortal
        >
          <Popover.Target>
            <Tooltip label="Click to change color" position="right" disabled={colorPopoverOpened}>
              <ColorSwatch
                color={item.color}
                onClick={colorPopoverHandler.open}
                sx={{ cursor: 'pointer', zIndex: 0 }}
              />
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={form.onSubmit((data) => {
                if (activeGroup) {
                  colorPopoverHandler.close();
                  editStockItem(activeGroup.id, item.id, schema.parse(data));
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
        <Tooltip label="Delete" withinPortal>
          <ActionIcon color="red" onClick={openDeleteModal}>
            <RiDeleteBin7Line />
          </ActionIcon>
        </Tooltip>
      </td>
    </Table.Row>
  );
}
