import { useRef } from 'react';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import {
  ActionIcon,
  createStyles,
  MantineSize,
  NumberInput,
  NumberInputHandlers,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: theme.radius[theme.defaultRadius as MantineSize],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],

    '&:focus-within': {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },

  control: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    boxShadow: theme.shadows.xs,
    transition: 'color 200ms',

    '&:disabled': {
      opacity: 0.8,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '&:hover': {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  input: {
    width: 70,
    textAlign: 'center',
    paddingRight: `${theme.spacing.sm}px !important`,
    paddingLeft: `${theme.spacing.sm}px !important`,
    height: 28,
    flex: 1,
  },
}));

interface QuantityInputProps {
  min?: number;
  max?: number;
  value?: number;
  onChange?(value: number | undefined): void;
}

export default function QuantityInput({ min, max, value, onChange }: QuantityInputProps) {
  const { classes } = useStyles();
  const handlers = useRef<NumberInputHandlers>(null);

  return (
    <div className={classes.wrapper}>
      <ActionIcon<'button'>
        size={28}
        variant="transparent"
        onClick={() => handlers.current?.decrement()}
        disabled={value === min}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <RiSubtractLine />
      </ActionIcon>
      <NumberInput
        variant="unstyled"
        min={min}
        max={max}
        handlersRef={handlers}
        value={value}
        onChange={onChange}
        classNames={{ input: classes.input }}
      />
      <ActionIcon<'button'>
        size={28}
        variant="transparent"
        onClick={() => handlers.current?.increment()}
        disabled={value === max}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <RiAddLine />
      </ActionIcon>
    </div>
  );
}
