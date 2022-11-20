import { RiPaintFill } from 'react-icons/ri';
import {
  ActionIcon,
  ColorInput,
  ColorInputProps,
  Menu,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { FloatingPosition } from '@mantine/core/lib/Floating';
import { useLocalStorage } from '@mantine/hooks';

interface MultiFormatColorInputProps extends ColorInputProps {
  menuPosition?: FloatingPosition;
}
type ColorFormat = 'hex' | 'rgb' | 'hsl';

const COLOR_FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl'];

export default function MultiFormatColorInput({
  menuPosition,
  ...props
}: MultiFormatColorInputProps) {
  const theme = useMantineTheme();

  const [preferredColorFormat, setPreferredColorFormat] = useLocalStorage<ColorFormat>({
    key: 'preferred-color-format',
    defaultValue: 'rgb',
  });

  return (
    <ColorInput
      placeholder="Select color"
      format={preferredColorFormat}
      fixOnBlur={false}
      rightSection={
        <Menu position={menuPosition}>
          <Menu.Target>
            <Tooltip label="Color format">
              <ActionIcon size="md">
                <RiPaintFill />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            {COLOR_FORMATS.map((format) => (
              <Menu.Item
                key={format}
                color={preferredColorFormat === format ? theme.fn.primaryColor() : undefined}
                onClick={() => setPreferredColorFormat(format)}
              >
                {format.toUpperCase()}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      }
      {...props}
    />
  );
}
