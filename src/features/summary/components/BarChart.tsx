import { Box, ColorSwatch, Group, Paper, Text, useMantineTheme } from '@mantine/core';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { linearGradientDef } from '@nivo/core';
import * as Filters from 'types/filters';

interface BarChartProps {
  data: BarDatum[];
  keys: string[];
  timeframe: Filters.Summary['timeframe'];
  height?: number;
  enableLeftTicks: boolean;
  enableLabels: boolean;
}

export default function BarChart({
  data,
  keys,
  timeframe,
  height = 260,
  enableLeftTicks,
  enableLabels,
}: BarChartProps) {
  const theme = useMantineTheme();

  return (
    <Box pt="md" sx={{ height, width: '100%' }}>
      {!!data.length && (
        <ResponsiveBar
          data={data}
          keys={keys}
          margin={{
            top: 6,
            bottom: timeframe === 'month' ? 6 : 28,
            left: enableLeftTicks ? 44 : 0,
          }}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band' }}
          axisLeft={{ tickValues: 3 }}
          axisBottom={
            timeframe === 'month'
              ? null
              : {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendPosition: 'middle',
                  legendOffset: 32,
                }
          }
          indexBy="month"
          groupMode={data.length <= 6 ? 'grouped' : 'stacked'}
          defs={[
            linearGradientDef('gradient', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: theme.colorScheme === 'dark' ? 0.25 : 0.5 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradient' }]}
          theme={{
            textColor: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            fontSize: 12,
            axis: { ticks: { line: { strokeWidth: enableLeftTicks ? 2 : 0 } } },
            crosshair: {
              line: {
                stroke: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
              },
            },
          }}
          tooltip={({ id, value, data }) => {
            const colorKey = data[`${id}Color`] as string;
            return (
              <Paper
                p="sm"
                bg={theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]}
                shadow={theme.shadows.md}
              >
                <Group key={id} spacing="sm">
                  <ColorSwatch size={14} color={theme.colors[colorKey][theme.fn.primaryShade()]} />
                  <Text size="sm" color="dimmed" inline>
                    {id}
                  </Text>
                  <Text size="sm" weight="bold" inline>
                    {value}
                  </Text>
                </Group>
              </Paper>
            );
          }}
          colors={({ id, data }) => {
            const colorKey = data[`${id}Color`] as string;
            return colorKey
              ? theme.colors[colorKey][theme.fn.primaryShade()]
              : theme.primaryColor[theme.fn.primaryShade()];
          }}
          enableLabel={enableLabels}
          labelTextColor={({ color }) =>
            theme.colorScheme === 'dark'
              ? theme.fn.lighten(color, 0.25)
              : theme.fn.darken(color, 0.25)
          }
          padding={0.4 / keys.length}
          borderRadius={4}
          enableGridY={false}
          motionConfig="default"
        />
      )}
    </Box>
  );
}
