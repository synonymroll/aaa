import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {useDarkMode} from 'usehooks-ts';
import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Flex,
  Header,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {IconBrandGithub, IconMoon, IconSun} from '@tabler/icons-react';

import NavMenu from './NavMenu';

export default function Dashboard() {
  const {colors} = useMantineTheme();
  const {isDarkMode, toggle} = useDarkMode();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      navbar={<NavMenu opened={opened} />}
      header={
        <Header height={{base: 50}} p="md">
          <Flex align="center" h="100%">
            <MediaQuery largerThan="sm" styles={{display: 'none'}}>
              <Burger
                opened={opened}
                size="sm"
                color={colors.gray[6]}
                onClick={() => setOpened(o => !o)}
              />
            </MediaQuery>
            <Center mx="auto">
              <Text fz="lg">It's Showtime</Text>
            </Center>
            <ActionIcon
              component="a"
              href="https://github.com/synonymroll/aaa"
              target="_blank"
              title="Source code"
            >
              <IconBrandGithub size="1.5rem" />
            </ActionIcon>
            <ActionIcon title={isDarkMode ? 'Light mode' : 'Dark mode'} onClick={toggle}>
              {isDarkMode ? <IconSun size="1.5rem" /> : <IconMoon size="1.5rem" />}
            </ActionIcon>
          </Flex>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
