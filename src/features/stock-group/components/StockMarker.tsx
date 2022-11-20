import { motion } from 'framer-motion';
import { deleteStockMarker } from 'lib/firebase/utils';
import { Stock } from 'types/stock';
import { useLongPress } from 'use-long-press';
import { Chip, ColorSwatch, Text, Tooltip, useMantineTheme } from '@mantine/core';

interface StockMarkerProps {
  activeGroup?: Stock.Group;
  marker: Stock.Marker;
}

export default function StockMarker({ activeGroup, marker }: StockMarkerProps) {
  const theme = useMantineTheme();
  const bind = useLongPress(
    () => {
      if (activeGroup) {
        deleteStockMarker(activeGroup.id, marker.id);
      }
    },
    { threshold: 500 },
  );

  const variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Tooltip label="Long press to delete" openDelay={1000}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        layout
        {...bind()}
      >
        <Chip
          value={marker.id}
          variant="filled"
          radius="md"
          styles={{
            root: { position: 'relative' },
            input: { position: 'absolute' },
            label: {
              display: 'flex',
              gap: theme.spacing.xs,
              padding: theme.spacing.md,
              '&[data-checked]': {
                padding: theme.spacing.md,
              },
            },
            iconWrapper: { display: 'flex', alignItems: 'center', width: 'fit-content' },
          }}
        >
          <ColorSwatch size={12} color={marker.color} />
          <Text size="sm" color="dimmed" inline>
            {marker.name}
          </Text>
          <Text size="sm" weight="bold" inline>
            {marker.value}
          </Text>
        </Chip>
      </motion.div>
    </Tooltip>
  );
}
