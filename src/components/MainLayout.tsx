import { ReactNode } from 'react';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiFilterLine,
  RiFilterOffLine,
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

const useStyles = createStyles(() => ({
  modalContainer: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
}));

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Stack spacing={0} sx={{ height: '100vh', flex: 1 }}>
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

  const toggleVisibleFilters = () => setVisibleFilters((prevState) => !prevState);
  const toggleVisibleNumbers = () => setVisibleNumbers((prevState) => !prevState);

  return (
    <MantineHeader height="fit-content" p="lg" zIndex={2} sx={{ position: 'relative', ...sx }}>
      <Box className={cx(classes.modalContainer, 'modal-container')} />
      <Title order={1} mb="md">
        {title}
      </Title>
      <Group spacing="sm">
        {buttons}
        <Group spacing={8} ml="auto">
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
        </Group>
      </Group>
      {filters && (
        <Collapse in={visibleFilters}>
          <Box pt="md">{filters}</Box>
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
