import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberInput,
  Popover,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { Table } from 'components';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { deleteOrder, editOrder } from 'lib/firebase/utils';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import { Dispatch, SetStateAction } from 'react';
import {
  RiCheckLine,
  RiDeleteBin7Line,
  RiLoaderLine,
  RiMoneyDollarCircleLine,
  RiPencilLine,
  RiUserFollowLine,
} from 'react-icons/ri';
import { Order } from 'types/order';

interface OrderItemProps {
  order: Order;
  clientName?: string;
  visibleNumbers: boolean;
  setFormValues: Dispatch<SetStateAction<Order | undefined>>;
  openOrderForm: () => void;
}

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
const STATUS_ITEMS = {
  pending: { color: 'yellow', icon: <RiLoaderLine /> },
  finished: { color: 'green', icon: <RiCheckLine /> },
  delivered: { color: 'cyan', icon: <RiUserFollowLine /> },
};
const MAX_PRICE = 999999999;

export default function OrderItem({
  order,
  clientName,
  visibleNumbers,
  setFormValues,
  openOrderForm,
}: OrderItemProps) {
  const theme = useMantineTheme();
  const isSmallScreen = useBreakpoints({ smallerThan: 'sm' });
  const form = useForm({
    initialValues: { price: null } as { price: number | null },
    validate: {
      price: (value) => {
        if (value == null) {
          return 'Invalid price';
        }
        if (value < 1) {
          return 'Price cannot be less than 1';
        }
        if (value > MAX_PRICE) {
          return `Price cannot be greater than ${MAX_PRICE}`;
        }
      },
    },
  });
  const [pricePopoverOpened, pricePopoverHandler] = useDisclosure(false);

  const commonModalProps = {
    centered: true,
    target: '.modal-container',
  };
  const openPendingModal = () =>
    openConfirmModal({
      title: <Title order={5}>Are you sure you want to mark this order as pending again?</Title>,
      children: <Text size="sm">The delivery date will be lost.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => editOrder(order.id, { status: 'pending', deliveredTimestamp: null }),
      ...commonModalProps,
    });
  const openDeleteModal = () =>
    openConfirmModal({
      title: <Title order={5}>Are you sure you want to delete this order?</Title>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => deleteOrder(order.id),
      confirmProps: { color: 'red' },
      ...commonModalProps,
    });
  const tooltipEvents = { hover: true, focus: true, touch: true };

  return (
    <Table.Row layoutId={order.id}>
      <td>
        <Popover
          position="right"
          trapFocus
          opened={pricePopoverOpened}
          onChange={pricePopoverHandler.toggle}
        >
          <Popover.Target>
            <Tooltip
              label={`Set as ${
                order.status === 'pending'
                  ? 'finished'
                  : order.status === 'finished'
                  ? 'delivered'
                  : 'pending'
              }`}
              openDelay={500}
              withinPortal
            >
              <Button
                size="xs"
                variant="light"
                color={STATUS_ITEMS[order.status].color}
                fullWidth
                onClick={() => {
                  switch (order.status) {
                    case 'pending': {
                      if (order.price) {
                        editOrder(order.id, { status: 'finished' });
                      } else {
                        form.reset();
                        pricePopoverHandler.open();
                      }
                      break;
                    }
                    case 'finished': {
                      editOrder(order.id, {
                        status: 'delivered',
                        deliveredTimestamp: dayjs().valueOf(),
                      });
                      break;
                    }
                    case 'delivered': {
                      openPendingModal();
                      break;
                    }
                  }
                }}
              >
                {isSmallScreen ? (
                  STATUS_ITEMS[order.status].icon
                ) : (
                  <Text transform="capitalize">{order.status}</Text>
                )}
              </Button>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={form.onSubmit(({ price }) => {
                if (price) {
                  pricePopoverHandler.close();
                  editOrder(order.id, { status: 'finished', price });
                }
              })}
            >
              <Group spacing="sm" align="flex-start">
                <NumberInput
                  icon={<RiMoneyDollarCircleLine />}
                  placeholder="Enter price"
                  min={1}
                  max={MAX_PRICE}
                  {...form.getInputProps('price')}
                />
                <ActionIcon variant="filled" color={theme.primaryColor} my={1} type="submit">
                  <RiCheckLine />
                </ActionIcon>
              </Group>
            </form>
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>{clientName || <Text italic>Deleted</Text>}</td>
      <td style={{ textAlign: 'right' }}>
        {visibleNumbers ? (
          order.price ? (
            `$${order.price.toLocaleString()}`
          ) : (
            <Badge p={0} color="gray" sx={{ backgroundColor: 'transparent' }}>
              Pending
            </Badge>
          )
        ) : (
          '*****'
        )}
      </td>
      <td>
        <Tooltip
          label={dayjs(order.receivedTimestamp).calendar(dayjs(), { sameElse: 'llll' })}
          events={tooltipEvents}
          openDelay={500}
        >
          <Text sx={{ cursor: 'help' }}>{dayjs(order.receivedTimestamp).format('L')}</Text>
        </Tooltip>
      </td>
      <td>
        <Tooltip
          label={dayjs(order.deliveredTimestamp).calendar(dayjs(), { sameElse: 'llll' })}
          events={tooltipEvents}
          openDelay={500}
          disabled={!order.deliveredTimestamp}
        >
          <Text sx={{ cursor: order.deliveredTimestamp ? 'help' : 'default' }}>
            {order.deliveredTimestamp ? dayjs(order.deliveredTimestamp).format('L') : '-'}
          </Text>
        </Tooltip>
      </td>
      <td>
        <Group position="right" spacing={0} noWrap>
          <Tooltip label="Edit">
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                setFormValues(order);
                openOrderForm();
              }}
            >
              <RiPencilLine />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red" onClick={openDeleteModal}>
              <RiDeleteBin7Line />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </Table.Row>
  );
}
