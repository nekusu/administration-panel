import { createStyles, Table as MantineTable, TableProps } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

const useStyles = createStyles((theme) => ({
  thead: {
    height: 50,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
  },
}));

export default function Table({ children, sx, ...props }: TableProps) {
  return (
    <MantineTable
      verticalSpacing="xs"
      horizontalSpacing="lg"
      {...props}
      sx={{ position: 'relative', ...sx }}
    >
      {children}
    </MantineTable>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { classes } = useStyles();

  return (
    <thead className={classes.thead}>
      <tr>{children}</tr>
    </thead>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <tbody>
      <AnimatePresence>{children}</AnimatePresence>
    </tbody>
  );
}

function Row({ children, layoutId, ...props }: { children: ReactNode; layoutId: string }) {
  return (
    <motion.tr
      style={{ cursor: 'default' }}
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layoutScroll
      {...props}
    >
      {children}
    </motion.tr>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
