import { ListManager, Load, MainLayout, Table } from 'components';
import { getDoc, orderBy, query } from 'firebase/firestore';
import { stockGroupsCollection, stockItemsCollection } from 'lib/firebase/collections';
import { addStockGroup } from 'lib/firebase/utils';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { RiAddLine, RiFolderSettingsLine } from 'react-icons/ri';
import { Filters } from 'types/filters';
import { Stock } from 'types/stock';
import { Button, Collapse, createStyles, Tabs } from '@mantine/core';
import { useDebouncedState, useDisclosure, useLocalStorage } from '@mantine/hooks';
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
  const stockGroupsQuery = query(stockGroupsCollection, orderBy('name', 'asc'));
  const [stockGroups, stockGroupsLoading] = useCollectionDataPersistent(stockGroupsQuery);

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

  const stockItemsQuery = activeGroup
    ? query(stockItemsCollection(activeGroup.id), orderBy(filters.orderBy, filters.direction))
    : null;
  const [stockItems, stockItemsLoading] = useCollectionDataPersistent(stockItemsQuery);
  const [searchValue, setSearchValue] = useDebouncedState('', 200);
  const filteredItems = useMemo(
    () => stockItems?.filter((item) => item.code.match(new RegExp(searchValue, 'gi'))),
    [stockItems, searchValue],
  );

  const [stockFormOpened, stockFormHandler] = useDisclosure(false);
  const [stockGroupListOpened, stockGroupListHandler] = useDisclosure(false);

  useEffect(() => {
    const currentGroup = stockGroups?.find(({ id }) => activeGroup?.id === id);
    if (currentGroup && currentGroup.name !== activeGroup?.name) {
      setActiveGroup(currentGroup);
    }
    if (!(stockGroups?.some(({ id }) => activeGroup?.id === id) || stockGroupsLoading)) {
      setActiveGroup(stockGroups?.[0]);
    }
  }, [stockGroups]);

  return (
    <MainLayout>
      <MainLayout.Header
        title="Stock"
        loading={stockGroupsLoading || stockItemsLoading}
        buttons={
          <>
            <Button leftIcon={<RiAddLine />} onClick={stockFormHandler.open}>
              New item
            </Button>
            <Button
              variant="light"
              leftIcon={<RiFolderSettingsLine />}
              onClick={stockGroupListHandler.open}
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
        pb={stockGroups?.length ? 0 : 'lg'}
        withBorder={!stockGroups?.length}
      >
        <Collapse in={!!stockGroups?.length}>
          <Tabs
            mx="-lg"
            pt="lg"
            value={activeGroup?.id}
            onTabChange={(value) => setActiveGroup(stockGroups?.find(({ id }) => value === id))}
          >
            <Tabs.List>
              {stockGroups?.map(({ id, name }, index) => (
                <Tabs.Tab
                  key={id}
                  className={classes.tab}
                  value={id}
                  ml={index === 0 ? 'lg' : undefined}
                  mr={index === stockGroups?.length - 1 ? 'lg' : undefined}
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
          stockGroups={stockGroups}
          stockItems={stockItems}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
        />
        <ListManager
          opened={stockGroupListOpened}
          close={stockGroupListHandler.close}
          label="group"
          items={stockGroups}
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
