import { Drawer, Navbar, Popover, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SidebarButton, ThemePopover } from 'components';
import { useGlobal } from 'context/global';
import useBreakpoints from 'lib/mantine/useBreakpoints';
import useWindowSize from 'lib/mantine/useWindowSize';
import { IconType } from 'react-icons/lib';
import { RiGithubLine, RiPaletteLine } from 'react-icons/ri';

interface SidebarProps {
  links: {
    icon: IconType;
    label: string;
  }[];
  opened: boolean;
  onClose(): void;
}

export default function Sidebar({ links, opened, onClose }: SidebarProps) {
  const { pageIndex, setGlobal } = useGlobal();
  const isSmallScreen = useBreakpoints({ smallerThan: 'sm' });
  const { height } = useWindowSize();
  const [themePopoverOpened, themePopoverHandler] = useDisclosure(false);

  let content = (
    <Navbar
      withBorder={!isSmallScreen}
      py="lg"
      px={isSmallScreen ? 'lg' : 'md'}
      sx={{ width: 'min-content', height }}
      zIndex={4}
    >
      <Navbar.Section grow>
        <Stack spacing={isSmallScreen ? 6 : 4}>
          {links.map((link, index) => (
            <SidebarButton
              {...link}
              key={link.label}
              small={isSmallScreen}
              active={index === pageIndex}
              onClick={() => {
                setGlobal((draft) => void (draft.pageIndex = index));
                if (isSmallScreen) onClose();
              }}
            />
          ))}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing={4}>
          <ThemePopover
            position={isSmallScreen ? 'top-start' : 'right'}
            opened={themePopoverOpened}
            onChange={themePopoverHandler.toggle}
          >
            <Popover.Target>
              <SidebarButton
                icon={RiPaletteLine}
                label="Theme"
                small={isSmallScreen}
                active={themePopoverOpened}
                onClick={themePopoverHandler.toggle}
              />
            </Popover.Target>
          </ThemePopover>
          <SidebarButton
            icon={RiGithubLine}
            label="Check out my GitHub!"
            small={isSmallScreen}
            onClick={() => window.open('https://github.com/nekusu', '_blank')}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );

  if (isSmallScreen) {
    content = (
      <Drawer
        size="auto"
        withCloseButton={false}
        opened={opened}
        onClose={onClose}
        styles={{ body: { padding: 0 } }}
      >
        {content}
      </Drawer>
    );
  }

  return content;
}
