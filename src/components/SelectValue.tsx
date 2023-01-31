import {
  Badge,
  CloseButton,
  DefaultMantineColor,
  Group,
  MultiSelectValueProps,
} from '@mantine/core';

export default function SelectValue({
  label,
  color,
  onRemove,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  classNames,
  ...others
}: MultiSelectValueProps & { color: DefaultMantineColor }) {
  return (
    <div {...others}>
      <Badge color={color} radius="sm" pr={4}>
        <Group spacing={4} noWrap>
          {label}
          <CloseButton
            onClick={onRemove}
            variant="transparent"
            color={color}
            size={14}
            iconSize={14}
            tabIndex={-1}
          />
        </Group>
      </Badge>
    </div>
  );
}
