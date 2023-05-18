import { Collapse, Stack } from '@mantine/core';
import { BarDatum } from '@nivo/bar';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { Load, Overview } from 'components';
import { useFilters } from 'context/filters';
import { useGlobal } from 'context/global';
import { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import * as Stock from 'types/stock';
import { BarChart, StockGroupFilters } from './components';

export default function StockGroup() {
  const { activeGroup } = useGlobal();
  const { stockGroup: filters } = useFilters();
  const { data: items } = useCollection<Stock.Item>(
    activeGroup ? { path: `groups/${activeGroup.id}/items`, orderBy: [['code', 'asc']] } : null
  );
  const { data: markers } = useCollection<Stock.Marker>(
    activeGroup ? { path: `groups/${activeGroup.id}/markers`, orderBy: [['value', 'desc']] } : null
  );
  const enabledMarkers = filters.enabledMarkers
    .map((id) => markers?.find((marker) => marker.id === id))
    .filter((marker) => !!marker) as Stock.Marker[];
  const { data, keys } = useMemo(() => {
    const data: BarDatum[] = [];
    const keys: string[] = [];

    if (items) {
      data.push(
        items.reduce((data, stockItem) => {
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
  }, [items]);
  const overviewItems = useMemo(() => {
    const overviewItems: { text: number; sub: string }[] = [];

    if (items && markers) {
      enabledMarkers.forEach(({ name, value }) => {
        overviewItems.push({
          text: items.filter(({ quantity }) => quantity < value).length,
          sub: name,
        });
      });
    }

    return overviewItems.sort((a, b) => b.text - a.text);
  }, [filters.enabledMarkers, items, markers]);

  return (
    <Stack>
      <Load in={!!items} style={{ minHeight: 336 }}>
        <Stack spacing={0}>
          <Overview items={[{ text: items?.length, sub: 'Items' }, ...overviewItems]} />
          <Collapse in={!!items?.length}>
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
      <StockGroupFilters markers={markers} activeGroup={activeGroup} />
    </Stack>
  );
}
