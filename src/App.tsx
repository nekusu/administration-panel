import { Box, Group } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { FloatingButton, MantineProviders, Sidebar, SidePanel } from 'components';
import { MotionConfig } from 'framer-motion';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import { lazy, Suspense } from 'react';
import { RiLayoutRightLine, RiMenuLine } from 'react-icons/ri';
import { Stock } from 'types/stock';

const OrdersPage = lazy(() => import('features/orders'));
const StockPage = lazy(() => import('features/stock'));
const Earnings = lazy(() => import('features/earnings'));
const StockGroup = lazy(() => import('features/stock-group'));

export default function App() {
  const isSmallScreen = useBreakpoints({ smallerThan: 'sm' });
  const [pageIndex, setPageIndex] = useLocalStorage({
    key: 'page-index',
    defaultValue: 0,
    getInitialValueInEffect: false,
  });
  const [visibleSidePanel, setVisibleSidePanel] = useLocalStorage({
    key: 'visible-side-panel',
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [visibleNumbers] = useLocalStorage({
    key: 'visible-numbers',
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [activeGroup, setActiveGroup] = useLocalStorage<Stock.Group | undefined>({
    key: 'active-group',
    getInitialValueInEffect: false,
  });
  const [sidebarOpened, sidebarHandler] = useDisclosure(false);

  const pages = [
    <OrdersPage visibleNumbers={visibleNumbers} />,
    <StockPage activeGroup={activeGroup} setActiveGroup={setActiveGroup} />,
  ];
  const sidePanelTitles = ['Earnings', activeGroup?.name];
  const sidePanels = [
    <Earnings visibleNumbers={visibleNumbers} />,
    <StockGroup activeGroup={activeGroup} />,
  ];

  return (
    <MantineProviders>
      <MotionConfig transition={{ duration: 0.2 }}>
        <Group spacing={0} noWrap>
          <Sidebar
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            opened={sidebarOpened}
            onClose={sidebarHandler.close}
          />
          <Box className="modal-container" sx={{ minWidth: 0, position: 'relative', flex: 1 }}>
            <Suspense>{pages[pageIndex]}</Suspense>
          </Box>
          <SidePanel
            opened={visibleSidePanel}
            onClose={() => setVisibleSidePanel(false)}
            title={sidePanelTitles[pageIndex]}
          >
            <Suspense>{sidePanels[pageIndex]}</Suspense>
          </SidePanel>
          {isSmallScreen && (
            <>
              <FloatingButton bottom={0} left={0} onClick={sidebarHandler.toggle}>
                <RiMenuLine />
              </FloatingButton>
              <FloatingButton bottom={0} right={0} onClick={() => setVisibleSidePanel(true)}>
                <RiLayoutRightLine />
              </FloatingButton>
            </>
          )}
        </Group>
      </MotionConfig>
    </MantineProviders>
  );
}
