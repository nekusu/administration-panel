import { ListItem } from 'components';
import { motion } from 'framer-motion';
import useWindowSize from 'lib/mantine/useWindowSize';
import { useEffect } from 'react';
import { RiSearchLine, RiUserAddLine } from 'react-icons/ri';
import {
  ActionIcon,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';

interface SampleType {
  id: string;
  name: string;
}

interface ListManagerProps<T extends SampleType> {
  opened: boolean;
  close: () => void;
  label: string;
  items?: T[];
  addItem(item: Omit<SampleType, 'id'>): void;
}

export default function ListManager<T extends SampleType>({
  opened,
  close,
  label,
  items,
  addItem,
}: ListManagerProps<T>) {
  const theme = useMantineTheme();
  const { height } = useWindowSize();
  const [searchValue, setSearchValue] = useInputState('');
  const filteredClients = items?.filter((item) => item.name.match(new RegExp(searchValue, 'gi')));
  const isExactMatch = !!filteredClients?.find(
    (item) => item.name.toLowerCase() === searchValue.toLowerCase(),
  );

  useEffect(() => {
    if (opened) {
      setSearchValue('');
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>{`Manage ${label}s`}</Title>}
      size={420}
      overflow="inside"
      trapFocus
      onClose={close}
      target=".modal-container"
      zIndex={2}
    >
      <Stack spacing="sm">
        <TextInput
          icon={<RiSearchLine />}
          placeholder={`Search ${label}`}
          maxLength={36}
          data-autofocus
          value={searchValue}
          onChange={setSearchValue}
        />
        <ScrollArea.Autosize maxHeight={`calc(${height}px - 240px)`}>
          <Stack spacing="xs" pb={2}>
            {filteredClients?.map((item) => (
              <ListItem key={item.id} item={item} label={label} />
            ))}
            {!!searchValue.length && !isExactMatch && (
              <motion.div style={{ display: 'flex', alignItems: 'center' }} layoutId="search">
                <Text size="sm" px="xs" sx={{ flex: 1 }}>
                  {searchValue}
                </Text>
                <Tooltip label={`Add ${label}`} withinPortal>
                  <ActionIcon
                    color={theme.primaryColor}
                    onClick={() => {
                      addItem({ name: searchValue });
                      setSearchValue('');
                    }}
                  >
                    <RiUserAddLine />
                  </ActionIcon>
                </Tooltip>
              </motion.div>
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
}
