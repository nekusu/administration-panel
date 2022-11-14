import { SidebarButton, ThemePopover } from 'components';
import {
  RiArchiveLine,
  RiBook2Line,
  RiGithubLine,
  RiPaletteLine,
} from 'react-icons/ri';
import { Navbar, Popover, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface SidebarProps {
  pageIndex: number;
  setPageIndex(value: number): void;
}

const links = [
  { icon: RiBook2Line, label: 'Orders' },
  { icon: RiArchiveLine, label: 'Stock' },
];

export default function Sidebar({ pageIndex, setPageIndex }: SidebarProps) {
  const [themePopoverOpened, themePopoverHandler] = useDisclosure(false);

  return (
    <Navbar py="lg" px="md" sx={{ width: 'min-content', minHeight: '100vh' }} zIndex="3">
      <Navbar.Section grow>
        <Stack spacing={4}>
          {links.map((link, index) => (
            <SidebarButton
              {...link}
              key={link.label}
              active={index === pageIndex}
              onClick={() => setPageIndex(index)}
            />
          ))}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing={4}>
          <ThemePopover
            position="right"
            opened={themePopoverOpened}
            onChange={themePopoverHandler.toggle}
          >
            <Popover.Target>
              <SidebarButton
                icon={RiPaletteLine}
                label="Theme"
                active={themePopoverOpened}
                onClick={themePopoverHandler.toggle}
              />
            </Popover.Target>
          </ThemePopover>
          <SidebarButton
            icon={RiGithubLine}
            label="Check out my GitHub!"
            onClick={() => window.open('https://github.com/nekusu', '_blank')}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
