import {
  ColorSwatch,
  DefaultMantineColor,
  MantineSize,
  SimpleGrid,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { RiCheckLine } from 'react-icons/ri';

interface ColorSelectProps {
  value: DefaultMantineColor;
  setValue: (
    val: DefaultMantineColor | ((prevState: DefaultMantineColor) => DefaultMantineColor)
  ) => void;
}

const colors = new Set<string>();

export default function ColorSelect({ value, setValue }: ColorSelectProps) {
  const theme = useMantineTheme();
  Object.keys(theme.colors).forEach((color) => colors.add(color));

  return (
    <SimpleGrid cols={Math.ceil(colors.size / 2)} spacing="xs">
      {[...colors].map((color) => (
        <Tooltip key={color} label={<Text transform="capitalize">{color}</Text>}>
          <ColorSwatch
            component="button"
            color={theme.colors[color][theme.fn.primaryShade()]}
            radius={theme.radius[theme.defaultRadius as MantineSize]}
            onClick={() => setValue(color)}
            sx={{ color: 'white', cursor: 'pointer' }}
          >
            {value === color && <RiCheckLine />}
          </ColorSwatch>
        </Tooltip>
      ))}
    </SimpleGrid>
  );
}
