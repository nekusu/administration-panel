import { ComponentPropsWithoutRef } from 'react';
import { Button, ButtonProps, Paper } from '@mantine/core';

export default function FloatingButton({
  children,
  top,
  left,
  bottom,
  right,
  ...props
}: ButtonProps & ComponentPropsWithoutRef<'button'>) {
  const position = { top, left, bottom, right };

  return (
    <Paper m="lg" shadow="md" sx={{ position: 'absolute', zIndex: 3 }} {...position}>
      <Button variant="light" size="md" p="sm" {...props}>
        {children}
      </Button>
    </Paper>
  );
}
