import { ReactNode } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createStyles, Table as MantineTable } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  thead: {
    height: 50,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
  },
}));

export default function Table({ children }: { children: ReactNode }) {
  return (
    <MantineTable verticalSpacing="xs" horizontalSpacing="lg" sx={{ position: 'relative' }}>
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
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();

  return <tbody ref={tableBody}>{children}</tbody>;
}

Table.Header = Header;
Table.Body = Body;
