import { CSSProperties, ReactNode, useRef } from 'react';
import { DragSizing } from 'react-drag-sizing';
import { Collapse, createStyles, Drawer, Paper, Title } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';

export interface SidePanelProps {
  children: ReactNode;
  title?: string;
  minWidth?: string | number;
  maxWidth?: string | number;
  style?: CSSProperties;
}

const useStyles = createStyles((theme) => ({
  handler: {
    '&:hover, &:active': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[4],

      '&::after': {
        content: '""',
        position: 'absolute',
        height: '10%',
        width: 4,
        top: '45%',
        left: 4,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[1],
        borderRadius: 2,
      },
    },
  },
  container: {
    position: 'relative',
    height: '100vh',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRadius: 0,
    overflowY: 'auto',
    zIndex: 3,
  },
}));

export default function SidePanel({
  children,
  title,
  minWidth = 400,
  maxWidth = 'min(900px, 45vw)',
  style,
}: SidePanelProps) {
  const { classes } = useStyles();
  const sidePanelRef = useRef<HTMLDivElement>(null);
  const isSpaceAvailable = useMediaQuery('(min-width: 1000px)');
  const [width, setWidth] = useLocalStorage({
    key: 'side-panel-width',
    defaultValue: 500,
  });
  const [visibleSidePanel, setVisibleSidePanel] = useLocalStorage({
    key: 'visible-side-panel',
    defaultValue: true,
  });

  return (
    <>
      {isSpaceAvailable ? (
        <Collapse in={visibleSidePanel} axis="x">
          <DragSizing
            border="left"
            style={{ width, minWidth, maxWidth, ...style }}
            handlerClassName={classes.handler}
            handlerWidth={12}
            onEnd={() => sidePanelRef.current && setWidth(sidePanelRef.current.offsetWidth)}
          >
            <Paper ref={sidePanelRef} className={classes.container} p="lg" withBorder>
              {title && (
                <Title order={1} mb="md">
                  {title}
                </Title>
              )}
              {children}
            </Paper>
          </DragSizing>
        </Collapse>
      ) : (
        <Drawer
          position="right"
          title={<Title order={1}>{title}</Title>}
          padding="lg"
          size="min(650px, 100vw)"
          opened={visibleSidePanel}
          onClose={() => setVisibleSidePanel(false)}
          styles={{ drawer: { overflowY: 'auto' } }}
        >
          {children}
        </Drawer>
      )}
    </>
  );
}
