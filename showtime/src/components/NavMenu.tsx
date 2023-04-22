import { NavLink as RouterLink, useMatches } from 'react-router-dom';
import { Navbar, NavLink } from '@mantine/core';

interface NavMenuProps {
  opened: boolean;
}

const menuItems = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Arnies',
    path: '/arnies',
  },
];

export default function NavMenu(props: NavMenuProps) {
  const { opened } = props;
  const matches = useMatches();
  const matchedPaths = new Set(matches.map((match) => match.pathname));
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: 300 }}
    >
      <Navbar.Section grow mt="md">
        {
          menuItems.map(({ name, path }) => {
            const match = path === '/'
              ? matchedPaths.size === 1
              : matchedPaths.has(path);
            return (
              <NavLink
                active={!!match}
                component={RouterLink}
                to={path}
                key={path}
                label={name}
              />
            );
          })
        }
      </Navbar.Section>
    </Navbar>
  );
}
