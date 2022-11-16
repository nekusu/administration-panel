import {
  FloatingButton,
  MantineProviders,
  Sidebar,
  SidePanel,
} from 'components';
import Earnings from 'features/earnings';
import Orders from 'features/orders';
import { RiLayoutRightLine, RiMenuLine } from 'react-icons/ri';
import { Group } from '@mantine/core';
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';

export default function App() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [pageIndex, setPageIndex] = useLocalStorage({ key: 'page-index', defaultValue: 0 });
  const [, setVisibleSidePanel] = useLocalStorage({
    key: 'visible-side-panel',
    defaultValue: true,
  });
  const [sidebarOpened, sidebarHandler] = useDisclosure(false);

  return (
    <MantineProviders>
      <Group spacing={0} noWrap>
        <Sidebar
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          opened={sidebarOpened}
          onClose={sidebarHandler.close}
        />
        <Orders />
        <SidePanel title="Earnings">
          <Earnings />
        </SidePanel>
      </Group>
      {isMobile && (
        <>
          <FloatingButton position={{ bottom: 0, left: 0 }} onClick={sidebarHandler.toggle}>
            <RiMenuLine />
          </FloatingButton>
          <FloatingButton
            position={{ bottom: 0, right: 0 }}
            onClick={() => setVisibleSidePanel(true)}
          >
            <RiLayoutRightLine />
          </FloatingButton>
        </>
      )}
    </MantineProviders>
  );
}
