import { DefaultMantineColor, Group, Indicator } from '@mantine/core';
import { forwardRef } from 'react';

interface SelectItemProps {
  color: DefaultMantineColor;
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ color, label, ...others }: SelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group ml={18} noWrap>
        <Indicator color={color} position="middle-start" offset={-14}>
          {label}
        </Indicator>
      </Group>
    </div>
  )
);

export default SelectItem;
