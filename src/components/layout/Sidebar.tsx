import {
  IconLayoutDashboard,
  IconCar,
  IconMessageCircle,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Box, NavLink, Stack, Text } from "@mantine/core";

interface SidebarProps {
  onNavigate?: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    description: "Overview",
    icon: IconLayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Vehicles",
    description: "Manage inventory",
    icon: IconCar,
    path: "/vehicles",
  },
  {
    label: "Inquiries",
    description: "Client requests",
    icon: IconMessageCircle,
    path: "/inquiries",
  },
  {
    label: "Administrators",
    description: "Manage access",
    icon: IconUsers,
    path: "/administrators",
  },
  {
    label: "Settings",
    description: "System preferences",
    icon: IconSettings,
    path: "/settings",
  },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <Stack h="100%" gap="xl">
      <Box>
        <Text fw={800} size="xl" c="white" style={{ letterSpacing: "3px" }}>
          AVASE
        </Text>

        <Text size="xs" c="dimmed" mt={4} style={{ letterSpacing: "1.5px" }}>
          ADMINISTRATION
        </Text>
      </Box>

      <Box>
        <Text
          size="xs"
          fw={700}
          c="dimmed"
          mb="sm"
          style={{ letterSpacing: "1px" }}
        >
          MAIN MENU
        </Text>

        <Stack gap={5}>
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (item.path !== "/dashboard" &&
                location.pathname.startsWith(`${item.path}/`));

            return (
              <NavLink
                key={item.path}
                component={RouterNavLink}
                to={item.path}
                label={item.label}
                description={item.description}
                leftSection={<Icon size={19} stroke={1.7} />}
                active={active}
                onClick={onNavigate}
                color="gold"
                variant="light"
                styles={{
                  root: {
                    borderRadius: 8,
                    color: active ? "#FFFFFF" : "#AAB4BA",
                    backgroundColor: active
                      ? "rgba(177, 140, 82, 0.16)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.06)",
                      color: "#FFFFFF",
                    },
                  },
                  label: {
                    fontWeight: 600,
                    fontSize: 13,
                  },
                  description: {
                    color: "#849099",
                    fontSize: 11,
                  },
                  section: {
                    color: active ? "#B18C52" : "#849099",
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Box mt="auto">
        <Box
          p="md"
          style={{
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10,
          }}
        >
          <Text size="xs" c="dimmed">
            AVASE LIMITED
          </Text>
          <Text size="xs" c="white" mt={5}>
            Premium Vehicle Sourcing
          </Text>
        </Box>
      </Box>
    </Stack>
  );
}
