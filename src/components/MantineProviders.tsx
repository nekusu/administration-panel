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
import { ReactNode } from 'react';

interface MantineProvidersProps {
  children: ReactNode;
}

const ActionIconDefaultProps: Partial<ActionIconProps> = {
  size: 'lg',
  variant: 'subtle',
};
const DrawerDefaultProps: Partial<DrawerProps> = {
  overlayProps: { opacity: 0.5 },
};
const LoaderDefaultProps: Partial<LoaderProps> = {
  size: 50,
};
const ModalDefaultProps: Partial<ModalProps> = {
  size: 'auto',
  shadow: 'lg',
  padding: 'lg',
  zIndex: 3,
  styles: {
    overlay: { position: 'absolute' },
    inner: { position: 'absolute', inset: 0, '&&': { paddingInline: '3vw' } },
    title: { fontWeight: 700 },
  },
  overlayProps: { opacity: 0.5 },
};
const NumberInputDefaultProps: Partial<NumberInputProps> = {
  precision: 0,
  removeTrailingZeros: true,
  stepHoldDelay: 500,
  stepHoldInterval: 50,
};
const PopoverDefaultProps: Partial<PopoverProps> = {
  shadow: 'lg',
  withinPortal: true,
};
const SelectDefaultProps: Partial<MultiSelectProps | SelectProps> = {
  clearable: true,
  maxDropdownHeight: 500,
  transitionProps: {
    transition: 'fade',
    duration: 200,
  },
  clearButtonProps: { tabIndex: -1 },
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
