import { SidebarButton, ThemePopover } from 'components';
import {
  RiArchiveLine,
  RiBook2Line,
  RiGithubLine,
  RiPaletteLine,
} from 'react-icons/ri';
import { Drawer, Navbar, Popover, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface SidebarProps {
  pageIndex: number;
  setPageIndex(value: number): void;
  opened: boolean;
  onClose(): void;
}

const links = [
  { icon: RiBook2Line, label: 'Orders' },
  { icon: RiArchiveLine, label: 'Stock' },
];

export default function Sidebar({ pageIndex, setPageIndex, opened, onClose }: SidebarProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [themePopoverOpened, themePopoverHandler] = useDisclosure(false);

  let content = (
    <Navbar
      withBorder={!isMobile}
      py="lg"
      px={isMobile ? 'lg' : 'md'}
      sx={{ width: 'min-content', minHeight: '100vh' }}
      zIndex="3"
    >
      <Navbar.Section grow>
        <Stack spacing={isMobile ? 6 : 4}>
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
            position={isMobile ? 'top-start' : 'right'}
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

  if (isMobile) {
    content = (
      <Drawer size="auto" withCloseButton={false} opened={opened} onClose={onClose}>
        {content}
      </Drawer>
    );
  }

  return content;
}
