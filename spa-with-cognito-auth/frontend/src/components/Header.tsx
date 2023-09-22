import { useState } from 'react';
import {
  Container,
  Group,
  Header as BaseHeader,
  Menu,
  UnstyledButton,
  Text,
  createStyles,
  rem,
  Skeleton,
  Box,
  Anchor,
} from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { IconLogout, IconChevronDown, IconUser } from '@tabler/icons-react';

import { useUser } from '../userContext.tsx';

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  logo: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

export function Header() {
  const { user, logout } = useUser();
  const { classes } = useStyles();
  const [, setUserMenuOpened] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => navigate('/profile');

  return (
    <BaseHeader height={60}>
      <Container className={classes.header}>
        <Box fz={34}>
          <Anchor component={Link} to="/" className={classes.logo}>
            😸
          </Anchor>
        </Box>

        {!user ? (
          <Skeleton animate={false} height={8} width={100} />
        ) : (
          <Menu
            width={220}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton>
                <Group spacing={7}>
                  <Text weight={500} sx={{ lineHeight: 1 }}>
                    Hi, {user.given_name}
                  </Text>
                  <IconChevronDown size={rem(15)} stroke={2} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                icon={<IconUser size="0.9rem" stroke={1.5} />}
                onClick={goToProfile}
              >
                Profile
              </Menu.Item>

              <Menu.Item
                icon={<IconLogout size="0.9rem" stroke={1.5} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Container>
    </BaseHeader>
  );
}
