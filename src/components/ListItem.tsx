import { ActionIcon, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core';
import { useClickOutside, useInputState } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { motion } from 'framer-motion';
import { deleteDocument, editDocument } from 'lib/firebase/utils';
import { useEffect, useRef, useState } from 'react';
import { RiCheckLine, RiDeleteBin7Line, RiPencilLine } from 'react-icons/ri';

interface SampleType {
  id: string;
  name: string;
}

interface ListItemProps<T extends SampleType> {
  item: T;
  label: string;
}

export default function ListItem<T extends SampleType>({ item, label }: ListItemProps<T>) {
  const theme = useMantineTheme();
  const listItemRef = useClickOutside(() => setEditMode(false));
  const inputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useInputState(item.name);
  const path = `${label}s`;

  const openDeleteModal = () =>
    openConfirmModal({
      title: `Are you sure you want to delete this ${label}?`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => deleteDocument(path, item.id),
      confirmProps: { color: 'red' },
      size: 'auto',
      centered: true,
      target: '.modal-container',
      zIndex: 3,
    });

  useEffect(() => {
    if (editMode) {
      setInputValue(item.name);
      inputRef.current?.focus();
    }
  }, [editMode]);

  return (
    <motion.div
      ref={listItemRef}
      style={{ display: 'flex', alignItems: 'center' }}
      layoutId={item.id}
      layoutScroll
    >
      {editMode ? (
        <>
          <TextInput
            ref={inputRef}
            placeholder="Enter name"
            data-autofocus
            pr="xs"
            styles={{
              input: {
                minHeight: 34,
                height: 34,
                paddingInline: '0.575rem',
              },
            }}
            sx={{ flex: 1 }}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
          />
          <Tooltip label="Confirm" withinPortal>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                setEditMode(false);
                editDocument(path, item.id, { name: inputValue });
              }}
            >
              <RiCheckLine />
            </ActionIcon>
          </Tooltip>
        </>
      ) : (
        <>
          <Text size="sm" px="xs" sx={{ flex: 1 }}>
            {item.name}
          </Text>
          <Tooltip label="Edit name" withinPortal>
            <ActionIcon color={theme.primaryColor} onClick={() => setEditMode(true)}>
              <RiPencilLine />
            </ActionIcon>
          </Tooltip>
        </>
      )}
      <Tooltip label="Delete" withinPortal>
        <ActionIcon color="red" onClick={openDeleteModal}>
          <RiDeleteBin7Line />
        </ActionIcon>
      </Tooltip>
    </motion.div>
  );
}
