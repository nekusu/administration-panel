import { Button, Collapse, createStyles, Tabs } from '@mantine/core';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { ListManager, Load, MainLayout, Table } from 'components';
import { useFilters } from 'context/filters';
import { useGlobal } from 'context/global';
import { getDoc } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import { addStockGroup } from 'lib/firebase/utils';
import { Fragment, useEffect, useMemo } from 'react';
import { RiAddLine, RiFolderSettingsLine } from 'react-icons/ri';
import * as Stock from 'types/stock';
import { StockFilters, StockForm, StockItem } from './components';

const useStyles = createStyles((theme) => ({
  tab: {
    '&[data-active]': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

export default function StockPage() {
  const { activeGroup, setGlobal } = useGlobal();
  const { stock: filters } = useFilters();
  const { classes } = useStyles();
  const { data: groups } = useCollection<Stock.Group>({
    path: 'groups',
    orderBy: [['name', 'asc']],
  });
  const { data: items } = useCollection<Stock.Item>(
    activeGroup
      ? { path: `groups/${activeGroup.id}/items`, orderBy: [[filters.orderBy, filters.direction]] }
      : null
  );
  const [searchValue, setSearchValue] = useDebouncedState('', 200);
  const filteredItems = useMemo(
    () => items?.filter((item) => item.code.match(new RegExp(searchValue, 'gi'))),
    [items, searchValue]
  );
  const [stockFormOpened, stockFormHandler] = useDisclosure(false);
  const [groupListOpened, groupListHandler] = useDisclosure(false);

  useEffect(() => {
    const currentGroup = groups?.find(({ id }) => activeGroup?.id === id);
    if (currentGroup && currentGroup.name !== activeGroup?.name)
      setGlobal((draft) => void (draft.activeGroup = currentGroup));
    if (!(groups?.some(({ id }) => activeGroup?.id === id) || !groups))
      setGlobal((draft) => void (draft.activeGroup = groups?.[0]));
  }, [groups]);

  return (
    <MainLayout>
      <MainLayout.Header
        title="Stock"
        loading={!groups || !items}
        buttons={
          <>
            <Button leftIcon={<RiAddLine />} onClick={stockFormHandler.open}>
              New item
            </Button>
            <Button
              variant="light"
              leftIcon={<RiFolderSettingsLine />}
              onClick={groupListHandler.open}
            >
              Manage groups
            </Button>
          </>
        }
        filters={<StockFilters setSearchValue={setSearchValue} />}
        pb={groups?.length ? 0 : 'lg'}
        withBorder={!groups?.length}
      >
        <Collapse in={!!groups?.length}>
          <Tabs
            mx="-lg"
            pt="lg"
            value={activeGroup?.id}
            onTabChange={(value) =>
              setGlobal(
                (draft) => void (draft.activeGroup = groups?.find(({ id }) => value === id))
              )
            }
          >
            <Tabs.List>
              {groups?.map(({ id, name }, index) => (
                <Tabs.Tab
                  key={id}
                  className={classes.tab}
                  value={id}
                  ml={index === 0 ? 'lg' : undefined}
                  mr={index === groups?.length - 1 ? 'lg' : undefined}
                >
                  {name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Collapse>
      </MainLayout.Header>
      <MainLayout.Body>
        <StockForm opened={stockFormOpened} closeForm={stockFormHandler.close} groups={groups} />
        <ListManager
          opened={groupListOpened}
          close={groupListHandler.close}
          label="group"
          items={groups}
          addItem={async (item) => {
            const newGroupRef = await addStockGroup(item);
            const newGroup = await getDoc(newGroupRef);
            setGlobal((draft) => void (draft.activeGroup = { id: newGroup.id, name: item.name }));
          }}
        />
        <Load in={!!filteredItems}>
          <Table>
            <Table.Header>
              <th style={{ width: 0 }}>Color</th>
              <th>Code</th>
              <th style={{ width: 0, textAlign: 'center' }}>Quantity</th>
              <th style={{ width: 0 }} />
            </Table.Header>
            <Table.Body>
              <AnimatePresence mode="wait">
                <Fragment key={activeGroup?.id}>
                  {filteredItems?.map((item) => (
                    <StockItem key={item.id} item={item} />
                  ))}
                </Fragment>
              </AnimatePresence>
            </Table.Body>
          </Table>
        </Load>
      </MainLayout.Body>
    </MainLayout>
  );
}
