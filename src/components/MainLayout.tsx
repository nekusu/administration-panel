import { ReactNode } from 'react';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiFilterLine,
  RiFilterOffLine,
  RiLayoutRight2Line,
  RiLayoutRightLine,
} from 'react-icons/ri';
import {
  Box,
  Button,
  Collapse,
  createStyles,
  Group,
  Header as MantineHeader,
  Stack,
  Sx,
  Title,
  Tooltip,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

interface HeaderProps {
  children?: ReactNode;
  title: string;
  buttons: ReactNode;
  filters?: ReactNode;
  withNumbersToggle?: boolean;
  sx?: Sx;
}

interface BodyProps {
  children: ReactNode;
  sx?: Sx;
}

const useStyles = createStyles((theme) => ({
  modalContainer: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  filtersGrid: {
    maxWidth: 1400,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Stack spacing={0} sx={{ height: '100vh', minWidth: 0, flex: 1 }}>
      {children}
    </Stack>
  );
}

function Header({ children, title, buttons, filters, withNumbersToggle, sx }: HeaderProps) {
  const { classes, cx } = useStyles();
  const [visibleFilters, setVisibleFilters] = useLocalStorage({
    key: 'visible-filters',
    defaultValue: true,
  });
  const [visibleNumbers, setVisibleNumbers] = useLocalStorage({
    key: 'visible-numbers',
    defaultValue: true,
  });
  const [visibleSidePanel, setVisibleSidePanel] = useLocalStorage({
    key: 'visible-side-panel',
    defaultValue: true,
  });

  const toggleVisibleFilters = () => setVisibleFilters((prevState) => !prevState);
  const toggleVisibleNumbers = () => setVisibleNumbers((prevState) => !prevState);
  const toggleVisibleSidePanel = () => setVisibleSidePanel((prevState) => !prevState);

  return (
    <MantineHeader height="fit-content" p="lg" zIndex={2} sx={{ position: 'relative', ...sx }}>
      <Box className={cx(classes.modalContainer, 'modal-container')} />
      <Group align="flex-start" mb="md">
        <Title order={1}>{title}</Title>
        <Group spacing={8} ml="auto" mt={6}>
          {filters && (
            <Tooltip label={visibleFilters ? 'Hide filters' : 'Show filters'} withinPortal>
              <Button
                variant={visibleFilters ? 'light' : 'subtle'}
                px="xs"
                onClick={toggleVisibleFilters}
              >
                {visibleFilters ? <RiFilterLine /> : <RiFilterOffLine />}
              </Button>
            </Tooltip>
          )}
          {withNumbersToggle && (
            <Tooltip label={visibleNumbers ? 'Hide numbers' : 'Show numbers'} withinPortal>
              <Button
                variant={visibleNumbers ? 'light' : 'subtle'}
                px="xs"
                onClick={toggleVisibleNumbers}
              >
                {visibleNumbers ? <RiEyeLine /> : <RiEyeOffLine />}
              </Button>
            </Tooltip>
          )}
          <Tooltip label={visibleSidePanel ? 'Hide side panel' : 'Show side panel'} withinPortal>
            <Button
              variant={visibleSidePanel ? 'light' : 'subtle'}
              px="xs"
              onClick={toggleVisibleSidePanel}
            >
              {visibleSidePanel ? <RiLayoutRightLine /> : <RiLayoutRight2Line />}
            </Button>
          </Tooltip>
        </Group>
      </Group>
      <Group spacing="sm">{buttons}</Group>
      {filters && (
        <Collapse in={visibleFilters}>
          <Box pt="sm" className={classes.filtersGrid}>
            {filters}
          </Box>
        </Collapse>
      )}
      {children}
    </MantineHeader>
  );
}

function Body({ children, sx }: BodyProps) {
  return <Stack sx={{ overflow: 'auto', flex: 1, ...sx }}>{children}</Stack>;
}

MainLayout.Header = Header;
MainLayout.Body = Body;
