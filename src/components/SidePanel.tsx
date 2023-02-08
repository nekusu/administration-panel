import { Collapse, createStyles, Drawer, Paper, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import useWindowSize from 'lib/mantine/useWindowSize';
import { CSSProperties, ReactNode, useRef } from 'react';
import { DragSizing } from 'react-drag-sizing';

export interface SidePanelProps {
  children: ReactNode;
  opened: boolean;
  onClose(): void;
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
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRadius: 0,
    overflowY: 'auto',
    zIndex: 4,
  },
}));

export default function SidePanel({
  children,
  opened,
  onClose,
  title,
  minWidth = 400,
  maxWidth = 'min(900px, 45vw)',
  style,
}: SidePanelProps) {
  const { classes, cx } = useStyles();
  const isLargeScreen = useBreakpoints({ largerThan: 'lg' });
  const { height } = useWindowSize();
  const [width, setWidth] = useLocalStorage({
    key: 'side-panel-width',
    defaultValue: 500,
    getInitialValueInEffect: false,
  });
  const sidePanelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isLargeScreen ? (
        <Collapse in={!!title && opened} axis="x">
          <DragSizing
            border="left"
            style={{ width, minWidth, maxWidth, ...style }}
            handlerClassName={classes.handler}
            handlerWidth={12}
            onEnd={() => sidePanelRef.current && setWidth(sidePanelRef.current.offsetWidth)}
          >
            <Paper
              ref={sidePanelRef}
              className={cx(classes.container, 'side-panel')}
              h={height}
              p="lg"
              withBorder
            >
              <Title order={1} mb="md">
                {title}
              </Title>
              {children}
            </Paper>
          </DragSizing>
        </Collapse>
      ) : (
        <Drawer
          classNames={{ drawer: 'side-panel' }}
          position="right"
          title={<Title order={1}>{title}</Title>}
          padding="lg"
          size="min(650px, 100vw)"
          opened={opened}
          onClose={onClose}
          styles={{ drawer: { overflowY: 'auto' } }}
        >
          {children}
        </Drawer>
      )}
    </>
  );
}
