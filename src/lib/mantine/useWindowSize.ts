import { useState } from 'react';
import { useWindowEvent } from '@mantine/hooks';

export default function useWindowSize() {
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useWindowEvent('resize', () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  });

  return { width, height };
}
