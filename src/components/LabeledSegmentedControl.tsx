import { SegmentedControl, SegmentedControlProps, Stack, Text } from '@mantine/core';

interface LabeledSegmentedControlProps extends SegmentedControlProps {
  label: string;
}

export default function LabeledSegmentedControl({ label, ...props }: LabeledSegmentedControlProps) {
  return (
    <Stack spacing={0}>
      <Text size="sm" weight="500" sx={{ cursor: 'default' }}>
        {label}
      </Text>
      <SegmentedControl {...props} mb={-2} />
    </Stack>
  );
}
