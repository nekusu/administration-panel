import {
  ActionIcon,
  Button,
  Checkbox,
  Chip,
  Group,
  HueSlider,
  NumberInput,
  Popover,
  Stack,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Load } from 'components';
import { useFilters } from 'context/filters';
import { AnimatePresence, motion } from 'framer-motion';
import { addStockMarker } from 'lib/firebase/utils';
import { useEffect } from 'react';
import { RiAddLine, RiBarChart2Line, RiPriceTag3Line } from 'react-icons/ri';
import * as Stock from 'types/stock';
import { z } from 'zod';
import { StockMarker } from './';

interface StockGroupFiltersProps {
  markers?: Stock.Marker[];
  activeGroup?: Stock.Group;
}

interface FormValues {
  color: number;
  name: string;
  value?: number;
}

const MAX_NAME_LENGTH = 10;
const MIN_VALUE = 1;
const MAX_VALUE = 100000;
const schema = z.object({
  color: z.number(),
  name: z.string().trim().min(1, { message: 'Required' }).max(MAX_NAME_LENGTH),
  value: z.number({ invalid_type_error: 'Required' }).min(MIN_VALUE).max(MAX_VALUE),
});

export default function StockGroupFilters({ markers, activeGroup }: StockGroupFiltersProps) {
  const { stockGroup: filters, setFilters } = useFilters();
  const theme = useMantineTheme();
  const form = useForm<FormValues>({
    initialValues: { color: 0, name: '' },
    validate: zodResolver(schema),
  });
  const [markerPopoverOpened, markerPopoverHandler] = useDisclosure(false);

  const addMarkerButton = (
    <Popover
      width={360}
      position={markers?.length ? 'bottom-end' : 'bottom-start'}
      trapFocus
      opened={markerPopoverOpened}
      onChange={markerPopoverHandler.toggle}
    >
      <Popover.Target>
        {markers?.length ? (
          <Tooltip label="Add marker">
            <motion.div layoutId="addMarkerButton">
              <ActionIcon
                color={theme.primaryColor}
                variant="light"
                size="md"
                onClick={markerPopoverHandler.toggle}
              >
                <RiAddLine />
              </ActionIcon>
            </motion.div>
          </Tooltip>
        ) : (
          <motion.div layoutId="addMarkerButton" style={{ width: 'fit-content' }}>
            <Button
              variant="light"
              leftIcon={<RiAddLine />}
              h={34}
              onClick={markerPopoverHandler.toggle}
            >
              Add marker
            </Button>
          </motion.div>
        )}
      </Popover.Target>
      <Popover.Dropdown p="md">
        <form
          onSubmit={form.onSubmit(({ color, ...data }) => {
            if (activeGroup) {
              markerPopoverHandler.close();
              addStockMarker(activeGroup.id, {
                color: `hsl(${color}, 100%, 50%)`,
                ...schema.omit({ color: true }).parse(data),
              });
            }
          })}
        >
          <Stack spacing="sm">
            <HueSlider
              value={form.values.color}
              onChange={(value) => form.setFieldValue('color', value)}
              onChangeEnd={(value) => form.setFieldValue('color', value)}
            />
            <Group align="flex-start" spacing="sm" grow>
              <TextInput
                label="Name"
                icon={<RiPriceTag3Line />}
                placeholder="Enter name"
                maxLength={MAX_NAME_LENGTH}
                data-autofocus
                {...form.getInputProps('name')}
              />
              <NumberInput
                label="Value"
                icon={<RiBarChart2Line />}
                placeholder="Enter value"
                min={MIN_VALUE}
                max={MAX_VALUE}
                {...form.getInputProps('value')}
              />
            </Group>
            <Group position="right">
              <Button variant="filled" type="submit">
                Confirm
              </Button>
            </Group>
          </Stack>
        </form>
      </Popover.Dropdown>
    </Popover>
  );

  useEffect(() => {
    if (markerPopoverOpened) {
      form.reset();
    }
  }, [markerPopoverOpened]);

  return (
    <Stack>
      <Stack spacing="xs">
        <Group position="apart">
          <Title order={3}>Markers</Title>
          {markers?.length && addMarkerButton}
        </Group>
        <Load in={!!markers} style={{ minHeight: 34 }}>
          {markers?.length ? (
            <Chip.Group
              value={filters.enabledMarkers}
              onChange={(value) =>
                setFilters((draft) => void (draft.stockGroup.enabledMarkers = value))
              }
              multiple
            >
              <Group spacing="xs">
                <AnimatePresence>
                  {markers?.map((marker) => (
                    <StockMarker key={marker.id} activeGroup={activeGroup} marker={marker} />
                  ))}
                </AnimatePresence>
              </Group>
            </Chip.Group>
          ) : (
            addMarkerButton
          )}
        </Load>
      </Stack>
      <Group pt={6}>
        <Checkbox
          checked={filters.enableLeftTicks}
          label="Enable left ticks"
          onChange={({ target: { checked } }) =>
            setFilters((draft) => void (draft.stockGroup.enableLeftTicks = checked))
          }
        />
        <Checkbox
          checked={filters.enableLabels}
          label="Enable labels"
          onChange={({ target: { checked } }) =>
            setFilters((draft) => void (draft.stockGroup.enableLabels = checked))
          }
        />
      </Group>
    </Stack>
  );
}
