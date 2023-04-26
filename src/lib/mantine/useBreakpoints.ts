import { MantineSize, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EitherField } from 'types/utilities';

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
    query = `(max-width: ${theme.breakpoints[smallerThan]})`;
  }
  if (largerThan) {
    query = `(min-width: ${theme.breakpoints[largerThan]})`;
  }
  const matches = useMediaQuery(query);

  return matches;
}
