import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Box, ColorSwatch, Group, Paper, Text, useMantineTheme } from '@mantine/core';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine, Serie } from '@nivo/line';

interface LineChartProps {
  data: Serie[];
  timeUnit: 'day' | 'month';
  height?: number;
  enableLeftTicks: boolean;
  enableBottomTicks: boolean;
}

dayjs.extend(customParseFormat);

export default function LineChart({
  data,
  timeUnit,
  height = 260,
  enableLeftTicks,
  enableBottomTicks,
}: LineChartProps) {
  const theme = useMantineTheme();

  return (
    <Box pt="md" sx={{ height, width: '100%' }}>
      {!!data[0].data.length && (
        <ResponsiveLine
          data={data}
          margin={{
            top: 6,
            right: 12,
            bottom: enableBottomTicks ? 28 : 6,
            left: enableLeftTicks ? 56 : 12,
          }}
          xScale={{
            type: 'time',
            format: timeUnit === 'day' ? '%Y-%m-%d' : '%b',
            useUTC: false,
            precision: timeUnit,
          }}
          xFormat={`time:${timeUnit === 'day' ? '%Y-%m-%d' : '%b'}`}
          yScale={{
            type: 'linear',
          }}
          axisLeft={{
            tickPadding: 10,
            tickValues: 2,
          }}
          axisBottom={{
            format: timeUnit === 'day' ? '%e' : '%b',
            tickPadding: 10,
            tickValues: `every ${timeUnit}`,
          }}
          curve="monotoneX"
          defs={[
            linearGradientDef('gradient', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          areaOpacity={theme.colorScheme === 'dark' ? 0.25 : 0.5}
          fill={[{ match: '*', id: 'gradient' }]}
          theme={{
            textColor: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            fontSize: 12,
            axis: {
              ticks: {
                line: {
                  strokeWidth: 0,
                },
              },
            },
            crosshair: {
              line: {
                stroke: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
              },
            },
          }}
          sliceTooltip={({ slice }) => (
            <Paper
              p="sm"
              bg={theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]}
              shadow={theme.shadows.md}
            >
              {slice.points.map((point) => (
                <Group key={point.id} spacing="sm">
                  <ColorSwatch size={14} color={point.serieColor} />
                  <Text size="sm" color="dimmed" inline>
                    {timeUnit === 'day'
                      ? dayjs(point.data.xFormatted).format('dddd, D MMM')
                      : dayjs(point.data.xFormatted, 'MMM').format('MMMM YYYY')}
                  </Text>
                  <Text size="sm" weight="bold" inline>
                    ${point.data.yFormatted}
                  </Text>
                </Group>
              ))}
            </Paper>
          )}
          colors={[theme.colors[theme.primaryColor][5]]}
          enableGridX={false}
          enableGridY={false}
          pointSize={8}
          pointBorderWidth={2}
          pointLabelYOffset={-12}
          enableArea={true}
          enableSlices="x"
          useMesh={true}
          motionConfig="default"
        />
      )}
    </Box>
  );
}
