import {
  ColorScheme,
  DefaultMantineColor,
  Group,
  Popover,
  SegmentedControl,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FloatingPosition } from '@mantine/core/lib/Floating';
import { useLocalStorage } from '@mantine/hooks';
import { ReactNode, useEffect } from 'react';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';
import { ColorSelect } from '.';

interface ThemePopoverProps {
  children: ReactNode;
  position: FloatingPosition;
  opened: boolean;
  onChange(opened: boolean): void;
}

const colors = new Set<string>();

export default function ThemePopover({ children, position, opened, onChange }: ThemePopoverProps) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [, setPrimaryColor] = useLocalStorage<DefaultMantineColor>({ key: 'primary-color' });

  useEffect(() => {
    Object.keys(theme.colors).forEach((color) => colors.add(color));
  }, [theme.colors]);

  return (
    <Popover position={position} opened={opened} onChange={onChange}>
      {children}
      <Popover.Dropdown>
        <Stack>
          <SegmentedControl
            data={[
              {
                label: (
                  <Group position='center' spacing='xs'>
                    <RiSunLine /> Light
                  </Group>
                ),
                value: 'light',
              },
              {
                label: (
                  <Group position='center' spacing='xs'>
                    <RiMoonLine /> Dark
                  </Group>
                ),
                value: 'dark',
              },
            ]}
            value={colorScheme}
            onChange={(value: ColorScheme) => toggleColorScheme(value)}
          />
          <ColorSelect value={theme.primaryColor} setValue={setPrimaryColor} />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
