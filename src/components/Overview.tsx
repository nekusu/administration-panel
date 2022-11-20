import { motion } from 'framer-motion';
import { Fragment } from 'react';
import { createStyles, Divider, Group, Paper, Text } from '@mantine/core';

interface OverviewProps {
  items: {
    text?: string | number;
    sub?: string;
  }[];
}

const useStyles = createStyles((theme) => ({
  container: {
    cursor: 'default',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
  },
  item: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    '&&': {
      flex: 1,
    },
  },
}));

export default function Overview({ items }: OverviewProps) {
  const { classes } = useStyles();

  return (
    <Paper p="xs" className={classes.container}>
      <Group>
        {items.map(({ text, sub }, index) => (
          <Fragment key={`${text}${sub}`}>
            <motion.div className={classes.item} layout>
              <Text size={26} weight="bold" inline>
                {text}
              </Text>
              <Text size="sm" weight="bold" color="dimmed" inline>
                {sub}
              </Text>
            </motion.div>
            {index < items.length - 1 && <Divider orientation="vertical" />}
          </Fragment>
        ))}
      </Group>
    </Paper>
  );
}
