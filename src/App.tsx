import { Box, Group } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { FloatingButton, MantineProviders, Sidebar, SidePanel } from 'components';
import Earnings from 'features/earnings';
import OrdersPage from 'features/orders';
import { MotionConfig } from 'framer-motion';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import { RiLayoutRightLine, RiMenuLine } from 'react-icons/ri';

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
  const [sidebarOpened, sidebarHandler] = useDisclosure(false);

  const pages = [<OrdersPage visibleNumbers={visibleNumbers} />];
  const sidePanelTitles = ['Earnings'];
  const sidePanels = [<Earnings visibleNumbers={visibleNumbers} />];

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
            {pages[pageIndex]}
          </Box>
          <SidePanel
            opened={visibleSidePanel}
            onClose={() => setVisibleSidePanel(false)}
            title={sidePanelTitles[pageIndex]}
          >
            {sidePanels[pageIndex]}
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
