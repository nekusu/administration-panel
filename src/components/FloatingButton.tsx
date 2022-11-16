import { Button, ButtonProps } from '@mantine/core';

interface FloatingButtonProps extends ButtonProps {
  position: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export default function FloatingButton({
  children,
  position,
  ...props
}: FloatingButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button
      variant="light"
      size="md"
      m="lg"
      p="sm"
      sx={(theme) => ({ position: 'absolute', boxShadow: theme.shadows.md, ...position })}
      {...props}
    >
      {children}
    </Button>
  );
}
