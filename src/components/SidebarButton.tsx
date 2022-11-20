import { forwardRef } from 'react';
import { IconType } from 'react-icons';
import { Button, createStyles, Tooltip } from '@mantine/core';

interface SidebarButtonProps {
  icon: IconType;
  label: string;
  small?: boolean;
  active?: boolean;
  onClick?(): void;
}

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    padding: theme.spacing.sm,
    display: 'flex',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: 'auto',
      height: 'auto',
      justifyContent: 'flex-start',
    },

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    },
  },
  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(function SidebarButton(
  { icon: Icon, label, small, active, onClick },
  ref,
) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" disabled={active || small}>
      <Button
        ref={ref}
        variant="subtle"
        leftIcon={small && <Icon />}
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        {small ? label : <Icon size={18} />}
      </Button>
    </Tooltip>
  );
});

export default SidebarButton;
