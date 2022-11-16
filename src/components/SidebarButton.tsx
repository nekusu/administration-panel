import { forwardRef } from 'react';
import { IconType } from 'react-icons';
import { Button, createStyles, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface SidebarButtonProps {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const useStyles = createStyles((theme, { isMobile }: { isMobile: boolean }) => ({
  link: {
    width: isMobile ? 'auto' : 50,
    height: isMobile ? 'auto' : 50,
    padding: theme.spacing.sm,
    display: 'flex',
    justifyContent: isMobile ? 'flex-start' : 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

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
  { icon: Icon, label, active, onClick },
  ref,
) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const { classes, cx } = useStyles({ isMobile });

  return (
    <Tooltip label={label} position="right" disabled={active || isMobile}>
      <Button
        ref={ref}
        variant="subtle"
        leftIcon={isMobile && <Icon />}
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        {isMobile ? label : <Icon size={18} />}
      </Button>
    </Tooltip>
  );
});

export default SidebarButton;
