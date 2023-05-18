import {
  Affix,
  Box,
  Button,
  Collapse,
  Group,
  Loader,
  Header as MantineHeader,
  HeaderProps as MantineHeaderProps,
  Stack,
  Sx,
  Title,
  Tooltip,
  Transition,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useMergedRef } from '@mantine/hooks';
import { useGlobal } from 'context/global';
import { AnimatePresence, motion } from 'framer-motion';
import useScroll from 'hooks/useScroll';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import useWindowSize from 'lib/mantine/useWindowSize';
import { ReactNode, forwardRef } from 'react';
import {
  RiArrowUpLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFilterLine,
  RiFilterOffLine,
  RiLayoutRight2Line,
  RiLayoutRightLine,
} from 'react-icons/ri';

interface HeaderProps extends Omit<MantineHeaderProps, 'children' | 'height'> {
  children?: ReactNode;
  title: string;
  loading?: boolean;
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
  filtersGrid: {
    maxWidth: 1400,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: theme.spacing.sm,
  },
}));

export default function MainLayout({ children }: { children: ReactNode }) {
  const { height } = useWindowSize();

  return (
    <Stack h={height} spacing={0}>
      {children}
    </Stack>
  );
}

function Header({
  children,
  title,
  loading,
  buttons,
  filters,
  withNumbersToggle,
  ...props
}: HeaderProps) {
  const { classes } = useStyles();
  const isSmallScreen = useBreakpoints({ smallerThan: 'sm' });
  const { visibleFilters, visibleNumbers, visibleSidePanel, setGlobal } = useGlobal();
  const [debouncedLoading] = useDebouncedValue(loading, 100);
  const toggleVisibleFilters = () =>
    setGlobal((draft) => void (draft.visibleFilters = !visibleFilters));
  const toggleVisibleNumbers = () =>
    setGlobal((draft) => void (draft.visibleNumbers = !visibleNumbers));
  const toggleVisibleSidePanel = () =>
    setGlobal((draft) => void (draft.visibleSidePanel = !visibleSidePanel));

  return (
    <MantineHeader height="fit-content" p="lg" {...props} styles={{ root: { zIndex: 2 } }}>
      <Group mb="md" spacing="xl">
        <Title order={1}>{title}</Title>
        <AnimatePresence>
          {loading && debouncedLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader sx={{ alignSelf: 'center' }} />
            </motion.div>
          )}
        </AnimatePresence>
        <Group spacing={8} ml="auto" mt={6} sx={{ alignSelf: 'flex-start' }}>
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
          {!isSmallScreen && (
            <Tooltip label={visibleSidePanel ? 'Hide side panel' : 'Show side panel'} withinPortal>
              <Button
                variant={visibleSidePanel ? 'light' : 'subtle'}
                px="xs"
                onClick={toggleVisibleSidePanel}
              >
                {visibleSidePanel ? <RiLayoutRightLine /> : <RiLayoutRight2Line />}
              </Button>
            </Tooltip>
          )}
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

const Body = forwardRef<HTMLDivElement, BodyProps>(function Body({ children, sx }, ref) {
  const theme = useMantineTheme();
  const { scroll, scrollTo, targetRef } = useScroll<HTMLDivElement>();
  const mergedRef = useMergedRef(ref, targetRef);

  return (
    <Stack ref={mergedRef} sx={{ position: 'relative', overflow: 'auto', flex: 1, ...sx }}>
      {children}
      <Affix
        position={{ bottom: 0, left: 0 }}
        target={targetRef.current ?? undefined}
        withinPortal={false}
        zIndex={0}
        sx={{ position: 'sticky' }}
      >
        <Transition transition="slide-up" mounted={scroll.y > 300}>
          {(styles) => (
            <Group w="100%" px="lg" pb="lg" position="center" style={styles}>
              <Button
                variant="light"
                leftIcon={<RiArrowUpLine />}
                onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ boxShadow: theme.shadows.md }}
              >
                Scroll to top
              </Button>
            </Group>
          )}
        </Transition>
      </Affix>
    </Stack>
  );
});

MainLayout.Header = Header;
MainLayout.Body = Body;
