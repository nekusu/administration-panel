import { ActionIcon, Badge, Group, Text, ThemeIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { Table } from 'components';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { deleteExpense } from 'lib/firebase/utils';
import { Dispatch, SetStateAction } from 'react';
import { RiDeleteBin7Line, RiInformationLine, RiPencilLine } from 'react-icons/ri';
import { Expense, Tag } from 'types/expense';

interface ExpenseItemProps {
  expense: Expense;
  tags?: Tag[];
  visibleNumbers: boolean;
  setFormValues: Dispatch<SetStateAction<Expense | undefined>>;
  openExpenseForm: () => void;
}

dayjs.extend(calendar);
dayjs.extend(localizedFormat);

export default function ExpenseItem({
  expense,
  tags,
  visibleNumbers,
  setFormValues,
  openExpenseForm,
}: ExpenseItemProps) {
  const theme = useMantineTheme();

  const openDeleteModal = () =>
    openConfirmModal({
      title: 'Are you sure you want to delete this expense?',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => deleteExpense(expense.id),
      confirmProps: { color: 'red' },
      centered: true,
      target: '.modal-container',
    });
  const tooltipEvents = { hover: true, focus: true, touch: true };

  return (
    <Table.Row layoutId={expense.id}>
      <td>
        <Group spacing={8} noWrap>
          {tags?.map((tag) => (
            <Badge key={tag.id} color={tag.color} radius="sm">
              {tag.name}
            </Badge>
          ))}
        </Group>
      </td>
      <td>{expense.description}</td>
      <td>
        <Group position={expense.deductFromFunds ? 'apart' : 'right'} spacing="sm" noWrap>
          {expense.deductFromFunds && (
            <Tooltip label="Deducted from funds" events={tooltipEvents} withinPortal>
              <ThemeIcon variant="light" radius="xl">
                <RiInformationLine />
              </ThemeIcon>
            </Tooltip>
          )}
          {visibleNumbers ? `$${expense.amount.toLocaleString()}` : '*****'}
        </Group>
      </td>
      <td>
        <Text>{dayjs(expense.date).format('L')}</Text>
      </td>
      <td>
        <Group position="right" spacing={0} noWrap>
          <Tooltip label="Edit" withinPortal>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                setFormValues(expense);
                openExpenseForm();
              }}
            >
              <RiPencilLine />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" withinPortal>
            <ActionIcon color="red" onClick={openDeleteModal}>
              <RiDeleteBin7Line />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </Table.Row>
  );
}
