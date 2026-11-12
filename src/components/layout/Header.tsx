
import {
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "../../features/auth/AuthContext";

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function Header({ opened, onToggle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <Group h="100%" px="lg" justify="space-between">
      <Group gap="md">
        <Burger
          opened={opened}
          onClick={onToggle}
          hiddenFrom="sm"
          size="sm"
          color="#18242C"
        />

        <Box>
          <Text fw={700} size="sm" c="#202A30">
            AVASE Admin Portal
          </Text>
          <Text size="xs" c="dimmed">
            Vehicle sourcing management
          </Text>
        </Box>
      </Group>

      <Menu shadow="md" width={220} position="bottom-end">
        <Menu.Target>
          <UnstyledButton>
            <Group gap="sm">
              <Avatar color="dark" radius="xl" size={38}>
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </Avatar>

              <Box visibleFrom="sm">
                <Text size="sm" fw={600} c="#202A30">
                  {user?.name || "Administrator"}
                </Text>
                <Text size="xs" c="dimmed">
                  {user?.role?.replace("_", " ") || "ADMIN"}
                </Text>
              </Box>

              <IconChevronDown size={15} color="#849099" />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>

          <Menu.Item leftSection={<IconUser size={16} />}>
            {user?.email}
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={logout}
          >
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
