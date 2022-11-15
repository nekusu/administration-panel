import { MantineProviders, Sidebar, SidePanel } from 'components';
import Orders from 'features/orders';
import { Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export default function App() {
  const [pageIndex, setPageIndex] = useLocalStorage({ key: 'page-index', defaultValue: 0 });

  return (
    <MantineProviders>
      <Group spacing={0} noWrap>
        <Sidebar pageIndex={pageIndex} setPageIndex={setPageIndex} />
        <Orders />
        <SidePanel title="Earnings">
          <Earnings />
        </SidePanel>
      </Group>
    </MantineProviders>
  );
}
