import { Load } from 'components';
import { AnimatePresence, motion } from 'framer-motion';
import { addStockMarker } from 'lib/firebase/utils';
import { useEffect } from 'react';
import { RiAddLine, RiBarChart2Line, RiPriceTag3Line } from 'react-icons/ri';
import { Filters } from 'types/filters';
import { Stock } from 'types/stock';
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
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { StockMarker } from './';

interface StockGroupFiltersProps {
  markers?: Stock.Marker[];
  activeGroup?: Stock.Group;
  filters: Filters.StockGroup;
  updateFilter(value: Partial<Filters.StockGroup>): void;
}
const MAX_VALUE = 999999;

export default function StockGroupFilters({
  markers,
  activeGroup,
  filters,
  updateFilter,
}: StockGroupFiltersProps) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { color: 0, name: '', value: 0 },
    validate: {
      name: (value) => (value ? null : 'Invalid name'),
      value: (value) => {
        if (value == null) {
          return 'Invalid value';
        }
        if (value < 1) {
          return 'Value cannot be less than 1';
        }
        if (value > MAX_VALUE) {
          return `Value cannot be greater than ${MAX_VALUE}`;
        }
      },
    },
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
          onSubmit={form.onSubmit(({ color, name, value }) => {
            if (activeGroup) {
              markerPopoverHandler.close();
              addStockMarker(activeGroup.id, {
                color: `hsl(${color}, 100%, 50%)`,
                name,
                value,
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
                maxLength={10}
                data-autofocus
                {...form.getInputProps('name')}
              />
              <NumberInput
                label="Value"
                icon={<RiBarChart2Line />}
                placeholder="Enter value"
                min={1}
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
              onChange={(value) => updateFilter({ enabledMarkers: value })}
              multiple
            >
              <AnimatePresence>
                {markers?.map((marker) => (
                  <StockMarker key={marker.id} activeGroup={activeGroup} marker={marker} />
                ))}
              </AnimatePresence>
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
          onChange={({ target: { checked } }) => updateFilter({ enableLeftTicks: checked })}
        />
        <Checkbox
          checked={filters.enableLabels}
          label="Enable labels"
          onChange={({ target: { checked } }) => updateFilter({ enableLabels: checked })}
        />
      </Group>
    </Stack>
  );
}
