import { Button, Collapse, createStyles, Tabs } from '@mantine/core';
import { useDebouncedState, useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { ListManager, Load, MainLayout, Table } from 'components';
import { getDoc } from 'firebase/firestore';
import { addStockGroup } from 'lib/firebase/utils';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { RiAddLine, RiFolderSettingsLine } from 'react-icons/ri';
import * as Filters from 'types/filters';
import * as Stock from 'types/stock';
import { StockFilters, StockForm, StockItem } from './components';

interface StockPageProps {
  activeGroup?: Stock.Group;
  setActiveGroup: Dispatch<SetStateAction<Stock.Group | undefined>>;
}

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

export default function StockPage({ activeGroup, setActiveGroup }: StockPageProps) {
  const { classes } = useStyles();
  const { data: groups } = useCollection<Stock.Group>({
    path: 'groups',
    orderBy: [['name', 'asc']],
  });

  const [filters, setFilters] = useLocalStorage<Filters.Stock>({
    key: 'stock-filters',
    defaultValue: {
      orderBy: 'code',
      direction: 'asc',
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.Stock>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

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
    if (currentGroup && currentGroup.name !== activeGroup?.name) {
      setActiveGroup(currentGroup);
    }
    if (!(groups?.some(({ id }) => activeGroup?.id === id) || !groups)) {
      setActiveGroup(groups?.[0]);
    }
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
        filters={
          <StockFilters
            setSearchValue={setSearchValue}
            filters={filters}
            updateFilter={updateFilter}
          />
        }
        pb={groups?.length ? 0 : 'lg'}
        withBorder={!groups?.length}
      >
        <Collapse in={!!groups?.length}>
          <Tabs
            mx="-lg"
            pt="lg"
            value={activeGroup?.id}
            onTabChange={(value) => setActiveGroup(groups?.find(({ id }) => value === id))}
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
        <StockForm
          opened={stockFormOpened}
          closeForm={stockFormHandler.close}
          groups={groups}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
        />
        <ListManager
          opened={groupListOpened}
          close={groupListHandler.close}
          label="group"
          items={groups}
          addItem={async (item) => {
            const newGroupRef = await addStockGroup(item);
            const newGroup = await getDoc(newGroupRef);
            setActiveGroup({ id: newGroup.id, name: item.name });
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
              {filteredItems?.map((item) => (
                <StockItem key={item.id} item={item} activeGroup={activeGroup} />
              ))}
            </Table.Body>
          </Table>
        </Load>
      </MainLayout.Body>
    </MainLayout>
  );
}
