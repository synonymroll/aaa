import {NavLink as RouterLink, useMatch} from 'react-router-dom';
import {Navbar, NavLink} from '@mantine/core';

interface NavMenuProps {
  opened: boolean;
};

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
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!props.opened}
      width={{base: 300}}
    >
      <Navbar.Section grow mt="md">
        {
          menuItems.map(({ name, path }) => {
            const match = useMatch({
              path,
              end: path === '/',
            });
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
