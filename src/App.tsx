import { Box, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FloatingButton, MantineProviders, SidePanel, Sidebar } from 'components';
import { FiltersProvider } from 'context/filters';
import { useGlobal } from 'context/global';
import { MotionConfig } from 'framer-motion';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import { Suspense, lazy } from 'react';
import {
  RiArchiveLine,
  RiBook2Line,
  RiFundsBoxLine,
  RiLayoutRightLine,
  RiMenuLine,
} from 'react-icons/ri';
import { SWRConfig } from 'swr';

const OrdersPage = lazy(() => import('features/orders'));
const StockPage = lazy(() => import('features/stock'));
const ExpensesPage = lazy(() => import('features/expenses'));
const Earnings = lazy(() => import('features/earnings'));
const StockGroup = lazy(() => import('features/stock-group'));
const Summary = lazy(() => import('features/summary'));

const links = [
  { icon: RiBook2Line, label: 'Orders' },
  { icon: RiArchiveLine, label: 'Stock' },
  { icon: RiFundsBoxLine, label: 'Expenses' },
];

export default function App() {
  const isSmallScreen = useBreakpoints({ smallerThan: 'sm' });
  const { activeGroup, pageIndex, setGlobal } = useGlobal();
  const [sidebarOpened, sidebarHandler] = useDisclosure(false);

  const pages = [<OrdersPage />, <StockPage />, <ExpensesPage />];
  const panels = [
    { component: <Earnings />, title: 'Earnings' },
    { component: <StockGroup />, title: activeGroup?.name },
    { component: <Summary />, title: 'Summary' },
  ];

  return (
    <MantineProviders>
      <FiltersProvider>
        <SWRConfig value={{ keepPreviousData: true }}>
          <MotionConfig transition={{ duration: 0.2 }}>
            <Group spacing={0} noWrap>
              <Sidebar links={links} opened={sidebarOpened} onClose={sidebarHandler.close} />
              <Box className="modal-container" sx={{ minWidth: 0, position: 'relative', flex: 1 }}>
                <Suspense>{pages[pageIndex]}</Suspense>
              </Box>
              <SidePanel title={panels[pageIndex].title}>
                <Suspense>{panels[pageIndex].component}</Suspense>
              </SidePanel>
              {isSmallScreen && (
                <>
                  <FloatingButton bottom={0} left={0} onClick={sidebarHandler.open}>
                    <RiMenuLine />
                  </FloatingButton>
                  <FloatingButton
                    bottom={0}
                    right={0}
                    onClick={() => setGlobal((draft) => void (draft.visibleSidePanel = true))}
                  >
                    <RiLayoutRightLine />
                  </FloatingButton>
                </>
              )}
            </Group>
          </MotionConfig>
        </SWRConfig>
      </FiltersProvider>
    </MantineProviders>
  );
}
