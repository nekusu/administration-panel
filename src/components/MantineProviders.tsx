import { ReactNode } from 'react';
import {
  ActionIconProps,
  ColorScheme,
  ColorSchemeProvider,
  DefaultMantineColor,
  DrawerProps,
  LoaderProps,
  MantineProvider,
  MantineThemeOverride,
  ModalProps,
  MultiSelectProps,
  NumberInputProps,
  PopoverProps,
  SelectProps,
  TextInputProps,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

interface MantineProvidersProps {
  children: ReactNode;
}

const ActionIconDefaultProps: Partial<ActionIconProps> = {
  size: 'lg',
  variant: 'subtle',
};
const DrawerDefaultProps: Partial<DrawerProps> = {};
const LoaderDefaultProps: Partial<LoaderProps> = {
  size: 50,
};
const ModalDefaultProps: Partial<ModalProps> = {
  size: 'auto',
  shadow: 'lg',
  zIndex: 3,
  sx: { position: 'absolute' },
};
const NumberInputDefaultProps: Partial<NumberInputProps> = {
  precision: 0,
  removeTrailingZeros: true,
  stepHoldDelay: 500,
  stepHoldInterval: 50,
};
const PopoverDefaultProps: Partial<PopoverProps> = {
  shadow: 'lg',
};
const SelectDefaultProps: Partial<MultiSelectProps | SelectProps> = {
  clearable: true,
  maxDropdownHeight: 500,
  transition: 'fade',
  transitionDuration: 200,
  clearButtonTabIndex: -1,
};
const InputDefaultProps: Partial<TextInputProps> = {
  autoComplete: 'off',
};
const theme: MantineThemeOverride = {
  cursorType: 'pointer',
  defaultRadius: 'md',
  loader: 'dots',
  components: {
    ActionIcon: { defaultProps: ActionIconDefaultProps },
    Drawer: { defaultProps: DrawerDefaultProps },
    Loader: { defaultProps: LoaderDefaultProps },
    Modal: { defaultProps: ModalDefaultProps },
    MultiSelect: { defaultProps: SelectDefaultProps },
    NumberInput: { defaultProps: NumberInputDefaultProps },
    Popover: { defaultProps: PopoverDefaultProps },
    Select: { defaultProps: SelectDefaultProps },
    TextInput: { defaultProps: InputDefaultProps },
    ColorInput: { defaultProps: InputDefaultProps },
  },
};

export default function MantineProviders({ children }: MantineProvidersProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: false,
  });
  const [primaryColor] = useLocalStorage<DefaultMantineColor>({
    key: 'primary-color',
    defaultValue: 'teal',
    getInitialValueInEffect: false,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  DrawerDefaultProps.overlayOpacity = colorScheme === 'dark' ? 0.8 : 0.4;
  ModalDefaultProps.overlayOpacity = colorScheme === 'dark' ? 0.8 : 0.4;

  return (
    <MantineProvider
      theme={{ ...theme, colorScheme, primaryColor }}
      withNormalizeCSS
      withGlobalStyles
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <ModalsProvider>{children}</ModalsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}
