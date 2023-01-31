import { Collapse, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BarDatum } from '@nivo/bar';
import { Load, Overview } from 'components';
import { orderBy, query } from 'firebase/firestore';
import { stockItemsCollection, stockMarkersCollection } from 'lib/firebase/collections';
import { useCollectionDataPersistent } from 'lib/react-firebase-hooks/useCollectionDataPersistent';
import { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import * as Filters from 'types/filters';
import * as Stock from 'types/stock';
import { BarChart, StockGroupFilters } from './components';

interface StockGroupProps {
  activeGroup?: Stock.Group;
}

export default function StockGroup({ activeGroup }: StockGroupProps) {
  const [filters, setFilters] = useLocalStorage<Filters.StockGroup>({
    key: 'stock-group-filters',
    defaultValue: {
      enabledMarkers: [],
      enableLeftTicks: false,
      enableLabels: true,
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.StockGroup>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

  const stockItemsQuery = activeGroup
    ? query(stockItemsCollection(activeGroup.id), orderBy('code', 'asc'))
    : null;
  const [stockItems] = useCollectionDataPersistent(stockItemsQuery);

  const stockMarkersQuery = activeGroup
    ? query(stockMarkersCollection(activeGroup.id), orderBy('value', 'desc'))
    : null;
  const [stockMarkers] = useCollectionDataPersistent(stockMarkersQuery);

  const enabledMarkers = filters.enabledMarkers
    .map((id) => stockMarkers?.find((marker) => marker.id === id))
    .filter((marker) => !!marker) as Stock.Marker[];

  const { data, keys } = useMemo(() => {
    const data: BarDatum[] = [];
    const keys: string[] = [];

    if (stockItems) {
      data.push(
        stockItems.reduce((data, stockItem) => {
          data[stockItem.code] = stockItem.quantity;
          data[`${stockItem.code}Color`] = stockItem.color
            ? tinycolor(stockItem.color).toHexString()
            : '';
          keys.push(stockItem.code);
          return data;
        }, {} as { [index: string]: string | number })
      );
    }

    return { data, keys };
  }, [stockItems]);
  const overviewItems = useMemo(() => {
    const items: { text: number; sub: string }[] = [];

    if (stockItems && stockMarkers) {
      enabledMarkers.forEach(({ name, value }) => {
        items.push({
          text: stockItems.filter(({ quantity }) => quantity < value).length,
          sub: name,
        });
      });
    }

    return items.sort((a, b) => b.text - a.text);
  }, [filters.enabledMarkers, stockItems, stockMarkers]);

  return (
    <Stack>
      <Load in={!!stockItems} style={{ minHeight: 336 }}>
        <Stack spacing={0}>
          <Overview items={[{ text: stockItems?.length, sub: 'Items' }, ...overviewItems]} />
          <Collapse in={!!stockItems?.length}>
            <BarChart
              data={data}
              keys={keys}
              markers={enabledMarkers}
              enableLeftTicks={filters.enableLeftTicks}
              enableLabels={filters.enableLabels}
            />
          </Collapse>
        </Stack>
      </Load>
      <StockGroupFilters
        markers={stockMarkers}
        activeGroup={activeGroup}
        filters={filters}
        updateFilter={updateFilter}
      />
    </Stack>
  );
}
