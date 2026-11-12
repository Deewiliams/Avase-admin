import { useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Image,
  Loader,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconCar,
  IconEye,
  IconPlus,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { Link as RouterLink } from "react-router-dom";

import { vehicleService } from "../vehicle-service";
import type { Vehicle, VehicleStatus } from "../vehicle-types";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "ARCHIVED", label: "Archived" },
];

const statusColors: Record<VehicleStatus, string> = {
  DRAFT: "gray",
  AVAILABLE: "green",
  RESERVED: "yellow",
  SOLD: "blue",
  ARCHIVED: "red",
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number) {
  return `${new Intl.NumberFormat("en-ZM").format(mileage)} km`;
}

function formatStatus(status: VehicleStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Image
            src={vehicle.images?.[0]?.url || null}
            alt={`${vehicle.make} ${vehicle.model}`}
            w={76}
            h={56}
            radius="md"
            fit="cover"
            fallbackSrc="https://placehold.co/120x90?text=No+Image"
          />

          <Stack gap={3}>
            <Text size="sm" fw={700} c="#18242C">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>

            <Text size="xs" c="dimmed">
              {vehicle.bodyType.replaceAll("_", " ")}
            </Text>

            {vehicle.isFeatured && (
              <Badge color="gold" variant="light" size="xs" w="fit-content">
                Featured
              </Badge>
            )}
          </Stack>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={600} c="#18242C">
          {formatPrice(vehicle.price, vehicle.currency)}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{formatMileage(vehicle.mileage)}</Text>
      </Table.Td>

      <Table.Td>
        <Badge color={statusColors[vehicle.status]} variant="light" radius="sm">
          {formatStatus(vehicle.status)}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Badge
          color={vehicle.isPublished ? "green" : "gray"}
          variant="light"
          radius="sm"
        >
          {vehicle.isPublished ? "Published" : "Unpublished"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="xs" c="dimmed">
          {new Date(vehicle.createdAt).toLocaleDateString("en-ZM")}
        </Text>
      </Table.Td>

      <Table.Td>
        <ActionIcon
          component={RouterLink}
          to={`/vehicles/${vehicle._id}`}
          variant="subtle"
          color="dark"
          aria-label={`View ${vehicle.make} ${vehicle.model}`}
        >
          <IconEye size={18} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await vehicleService.getVehicles({
          page,
          limit: PAGE_SIZE,
          search,
          status: status === "ALL" ? "" : (status as VehicleStatus),
        });

        if (!isActive) return;

        setVehicles(response.data.vehicles);
        setTotal(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err: any) {
        if (!isActive) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load vehicles.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [page, search, status]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value || "ALL");
    setPage(1);
  };

  const handleRefresh = () => {
    // Changing the page triggers the request; this is handled below.
    setPage((current) => current);
    setSearch((current) => `${current}`);
  };

  const firstRecord = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRecord = Math.min(page * PAGE_SIZE, total);

  return (
    <Stack gap="lg">
      {/* Heading */}
      <Group justify="space-between" align="flex-start">
        <Stack gap={5}>
          <Text size="xs" fw={700} c="#B18C52">
            INVENTORY MANAGEMENT
          </Text>

          <Title order={2} c="#18242C">
            Vehicles
          </Title>

          <Text size="sm" c="dimmed">
            Manage your premium vehicle inventory and listings.
          </Text>
        </Stack>

        <Button
          component={RouterLink}
          to="/vehicles/new"
          color="dark"
          leftSection={<IconPlus size={17} />}
        >
          Add Vehicle
        </Button>
      </Group>

      {/* Search and filters */}
      <Paper p="md" radius="lg" withBorder>
        <Group grow align="flex-end">
          <TextInput
            label="Search vehicles"
            placeholder="Search by make or model..."
            leftSection={<IconSearch size={17} />}
            value={search}
            onChange={(event) => handleSearch(event.currentTarget.value)}
          />

          <Select
            label="Vehicle status"
            data={statusOptions}
            value={status}
            onChange={handleStatusChange}
            allowDeselect={false}
          />

          <Button
            variant="light"
            color="dark"
            leftSection={<IconRefresh size={16} />}
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setPage(1);
            }}
          >
            Reset filters
          </Button>
        </Group>
      </Paper>

      {/* Vehicle table */}
      <Paper radius="lg" withBorder style={{ overflow: "hidden" }}>
        <Group justify="space-between" p="md">
          <Stack gap={3}>
            <Title order={4} c="#18242C">
              Vehicle Inventory
            </Title>

            <Text size="xs" c="dimmed">
              {total} vehicle{total === 1 ? "" : "s"} found
            </Text>
          </Stack>
        </Group>

        {error && (
          <Paper
            mx="md"
            mb="md"
            p="md"
            radius="md"
            style={{ backgroundColor: "#FFF1F0" }}
          >
            <Group justify="space-between">
              <Text size="sm" c="red">
                {error}
              </Text>

              <Button
                size="xs"
                color="red"
                variant="light"
                onClick={() => {
                  setPage((current) => (current === 1 ? 2 : 1));
                }}
              >
                Retry
              </Button>
            </Group>
          </Paper>
        )}

        <Table.ScrollContainer minWidth={950}>
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Vehicle</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Mileage</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Publication</Table.Th>
                <Table.Th>Date Added</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Stack align="center" py="xl">
                      <Loader color="dark" size="sm" />
                      <Text size="sm" c="dimmed">
                        Loading vehicles...
                      </Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ) : vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <VehicleRow key={vehicle._id} vehicle={vehicle} />
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Stack align="center" py={50} gap="sm">
                      <IconCar size={38} color="#ADB5BD" />

                      <Text fw={600} c="#18242C">
                        No vehicles found
                      </Text>

                      <Text size="sm" c="dimmed">
                        Try adjusting your search or filters.
                      </Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* Pagination */}
        <Group
          justify="space-between"
          p="md"
          style={{ borderTop: "1px solid #E9ECEF" }}
        >
          <Text size="xs" c="dimmed">
            Showing {firstRecord}–{lastRecord} of {total}
          </Text>

          <Pagination
            total={Math.max(totalPages, 1)}
            value={page}
            onChange={setPage}
            color="dark"
            size="sm"
            disabled={isLoading || totalPages <= 1}
          />
        </Group>
      </Paper>
    </Stack>
  );
}
