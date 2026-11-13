import {
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCar,
  IconMessageCircle,
  IconPlus,
  IconTrendingUp,
  IconUsers,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { dashboardService } from "./dashboard-service";
import type { DashboardOverview } from "./dashboard-types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        setIsLoading(true);

        const response = await dashboardService.getDashboardOverview();

        if (response.success) {
          setOverview(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard overview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardOverview();
  }, []);

  const statistics = [
    {
      label: "Total Vehicles",
      value: isLoading
        ? "..."
        : (overview?.totalVehicles ?? 0).toLocaleString(),
      description: "Vehicle inventory",
      icon: IconCar,
    },
    {
      label: "Available Vehicles",
      value: isLoading
        ? "..."
        : (overview?.availableVehicles ?? 0).toLocaleString(),
      description: "Currently listed",
      icon: IconTrendingUp,
    },
    {
      label: "Client Inquiries",
      value: isLoading
        ? "..."
        : (overview?.clientInquiries ?? 0).toLocaleString(),
      description: "Requests received",
      icon: IconMessageCircle,
    },
    {
      label: "Registered Admins",
      value: isLoading
        ? "..."
        : (overview?.registeredAdmins ?? 0).toLocaleString(),
      description: "System administrators",
      icon: IconUsers,
    },
  ];

  return (
    <Stack gap="xl">
      {/* Page heading */}
      <Group justify="space-between" align="flex-start">
        <Stack gap={5}>
          <Text size="xs" fw={700} c="#B18C52">
            OVERVIEW
          </Text>

          <Title order={2} c="#18242C">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </Title>

          <Text size="sm" c="dimmed">
            Here's an overview of your AVASE operations.
          </Text>
        </Stack>

        <Badge color="green" variant="light" size="lg" radius="sm">
          Admin Portal
        </Badge>
      </Group>

      {/* Statistics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <Paper
              key={stat.label}
              p="lg"
              radius="lg"
              withBorder
              style={{
                borderColor: "#E9ECEF",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Stack gap={8}>
                  <Text size="sm" c="dimmed" fw={500}>
                    {stat.label}
                  </Text>

                  <Title order={2} c="#18242C">
                    {stat.value}
                  </Title>

                  <Text size="xs" c="dimmed">
                    {stat.description}
                  </Text>
                </Stack>

                <ThemeIcon size={44} radius="md" variant="light" color="gold">
                  <Icon size={22} stroke={1.6} />
                </ThemeIcon>
              </Group>
            </Paper>
          );
        })}
      </SimpleGrid>

      {/* Main dashboard content */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper
            p="lg"
            radius="lg"
            withBorder
            h="100%"
            style={{
              borderColor: "#E9ECEF",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Group justify="space-between" mb="lg">
              <Stack gap={4}>
                <Title order={4} c="#18242C">
                  Vehicle Inventory
                </Title>
                <Text size="xs" c="dimmed">
                  Manage the vehicles available through AVASE.
                </Text>
              </Stack>

              <Button
                component={RouterLink}
                to="/vehicles"
                variant="subtle"
                color="dark"
                rightSection={<IconArrowRight size={15} />}
                size="xs"
              >
                View inventory
              </Button>
            </Group>

            <Stack align="center" justify="center" py={45} gap="sm">
              <ThemeIcon size={58} radius="xl" variant="light" color="gray">
                <IconCar size={28} />
              </ThemeIcon>

              <Text fw={600} c="#202A30">
                Your vehicle inventory will appear here
              </Text>

              <Text size="sm" c="dimmed" ta="center" maw={340}>
                Once vehicles are added, this section will provide a quick
                overview of your vehicle listings.
              </Text>

              <Button
                component={RouterLink}
                to="/vehicles"
                color="dark"
                leftSection={<IconPlus size={16} />}
                mt="sm"
              >
                Manage vehicles
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            p="lg"
            radius="lg"
            withBorder
            h="100%"
            style={{
              borderColor: "#E9ECEF",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Title order={4} c="#18242C" mb={4}>
              Quick Actions
            </Title>

            <Text size="xs" c="dimmed" mb="lg">
              Frequently used administration tasks.
            </Text>

            <Stack gap="sm">
              <Button
                component={RouterLink}
                to="/vehicles"
                variant="light"
                color="dark"
                justify="space-between"
                rightSection={<IconArrowRight size={16} />}
                fullWidth
              >
                Manage vehicles
              </Button>

              <Button
                component={RouterLink}
                to="/inquiries"
                variant="light"
                color="dark"
                justify="space-between"
                rightSection={<IconArrowRight size={16} />}
                fullWidth
              >
                View client inquiries
              </Button>

              <Button
                component={RouterLink}
                to="/administrators"
                variant="light"
                color="dark"
                justify="space-between"
                rightSection={<IconArrowRight size={16} />}
                fullWidth
              >
                Manage administrators
              </Button>
            </Stack>

            {/* <Paper
              mt="xl"
              p="md"
              radius="md"
              style={{ backgroundColor: "#F8F6F1" }}
            >
              <Text size="xs" fw={700} c="#9B7945">
                AVASE STANDARD
              </Text>

              <Text size="sm" fw={600} c="#18242C" mt={6}>
                Premium vehicle sourcing
              </Text>

              <Text size="xs" c="dimmed" mt={4}>
                Delivering a professional vehicle sourcing experience to every
                client.
              </Text>
            </Paper> */}
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
