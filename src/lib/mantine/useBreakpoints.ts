import { EitherField } from 'types/utilities';
import { MantineSize, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface BreakpointsParams {
  smallerThan: MantineSize;
  largerThan: MantineSize;
}

export default function useBreakpoints({
  smallerThan,
  largerThan,
}: EitherField<BreakpointsParams>) {
  const theme = useMantineTheme();
  let query = '';

  if (smallerThan) {
    query = `(max-width: ${theme.breakpoints[smallerThan]}px)`;
  }
  if (largerThan) {
    query = `(min-width: ${theme.breakpoints[largerThan]}px)`;
  }
  const matches = useMediaQuery(query);

  return matches;
}
