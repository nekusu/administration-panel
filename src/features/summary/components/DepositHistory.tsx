import {
  ActionIcon,
  Alert,
  MantineSize,
  Modal,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { Table } from 'components';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { deleteFund } from 'lib/firebase/utils';
import { RiDeleteBin7Line, RiFileUnknowLine } from 'react-icons/ri';
import { Deposit } from 'types/expense';

interface DepositHistoryProps {
  opened: boolean;
  close: () => void;
  deposits?: Deposit[];
}

dayjs.extend(localizedFormat);

export default function DepositHistory({ opened, close, deposits }: DepositHistoryProps) {
  const theme = useMantineTheme();

  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: <Title order={5}>Are you sure you want to delete this deposit?</Title>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => deleteFund(id),
      confirmProps: { color: 'red' },
      centered: true,
      target: '.side-panel',
      styles: { overlay: { '&&': { position: 'absolute' } } },
    });

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>Deposit history</Title>}
      size={440}
      trapFocus
      onClose={close}
      target=".side-panel"
      styles={{ overlay: { '&&': { position: 'absolute' } } }}
    >
      {deposits?.length ? (
        <Table
          horizontalSpacing="sm"
          withBorder
          style={{
            borderRadius: theme.radius[theme.defaultRadius as MantineSize],
            borderSpacing: 0,
            borderCollapse: 'separate',
            overflow: 'hidden',
          }}
        >
          <Table.Header>
            <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '25%' }}>Amount</th>
            <th style={{ textAlign: 'center' }}>Date</th>
            <th style={{ width: 0 }} />
          </Table.Header>
          <Table.Body>
            {deposits.map(({ id, amount, date }) => (
              <Table.Row key={id} layoutId={id}>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  ${amount.toLocaleString()}
                </td>
                <td style={{ textAlign: 'center' }}>{dayjs(date).format('L')}</td>
                <td>
                  <Tooltip label="Delete" withinPortal>
                    <ActionIcon color="red" onClick={() => openDeleteModal(id)}>
                      <RiDeleteBin7Line />
                    </ActionIcon>
                  </Tooltip>
                </td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Alert h={48} icon={<RiFileUnknowLine />} title="No recorded history">
          {''}
        </Alert>
      )}
    </Modal>
  );
}
