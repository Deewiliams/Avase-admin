import { useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconEye, IconSearch } from "@tabler/icons-react";

import { enquiryService } from "./enquiry-service";

import type { Enquiry, EnquiryStatus } from "./enquiry-types";
import EnquiryDetails from "./EnquiryDetails";

interface EnquiryStats {
  total: number;
  new: number;
  inDiscussion: number;
  converted: number;
}

const PAGE_SIZE = 10;

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_DISCUSSION", label: "In Discussion" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
  { value: "SPAM", label: "Spam" },
];

const getStatusColor = (status: EnquiryStatus) => {
  switch (status) {
    case "NEW":
      return "blue";
    case "CONTACTED":
      return "cyan";
    case "IN_DISCUSSION":
      return "orange";
    case "CONVERTED":
      return "green";
    case "CLOSED":
      return "gray";
    case "SPAM":
      return "red";
    default:
      return "gray";
  }
};

const formatStatus = (status: EnquiryStatus) => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const formatEnquiryType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap={6}>
        <Text size="sm" c="dimmed" fw={500}>
          {label}
        </Text>

        <Title order={2} c={color}>
          {value.toLocaleString()}
        </Title>
      </Stack>
    </Paper>
  );
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats>({
    total: 0,
    new: 0,
    inDiscussion: 0,
    converted: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch enquiries
  useEffect(() => {
    let cancelled = false;

    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await enquiryService.getEnquiries({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch || undefined,
          status: (status as EnquiryStatus | null) || undefined,
        });

        if (cancelled) return;

        setEnquiries(response.data);
        setTotalPages(response.pagination.totalPages || 1);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch enquiries:", err);
        setError("Unable to load enquiries. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEnquiries();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, refreshKey]);

  // Fetch global statistics independently of table filters
  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const [
          allResponse,
          newResponse,
          discussionResponse,
          convertedResponse,
        ] = await Promise.all([
          enquiryService.getEnquiries({ page: 1, limit: 1 }),
          enquiryService.getEnquiries({
            page: 1,
            limit: 1,
            status: "NEW",
          }),
          enquiryService.getEnquiries({
            page: 1,
            limit: 1,
            status: "IN_DISCUSSION",
          }),
          enquiryService.getEnquiries({
            page: 1,
            limit: 1,
            status: "CONVERTED",
          }),
        ]);

        if (cancelled) return;

        setStats({
          total: allResponse.pagination.total,
          new: newResponse.pagination.total,
          inDiscussion: discussionResponse.pagination.total,
          converted: convertedResponse.pagination.total,
        });
      } catch (err) {
        console.error("Failed to fetch enquiry statistics:", err);
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
}, [refreshKey]);

  const handleStatusFilter = (value: string | null) => {
    setStatus(value);
    setPage(1);
  };

  const rows = enquiries.map((enquiry) => {
    const vehicleName = [
      enquiry.vehicleSnapshot?.year,
      enquiry.vehicleSnapshot?.make,
      enquiry.vehicleSnapshot?.model,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Table.Tr key={enquiry._id}>
        <Table.Td>
          <Text fw={600} size="sm">
            {enquiry.customerName}
          </Text>

          <Text size="xs" c="dimmed">
            {enquiry.email || "No email provided"}
          </Text>

          <Text size="xs" c="dimmed">
            {enquiry.phone}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text size="sm" fw={500}>
            {vehicleName || "Vehicle unavailable"}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text size="sm">{formatEnquiryType(enquiry.enquiryType)}</Text>
        </Table.Td>

        <Table.Td>
          <Text size="sm">{formatDate(enquiry.createdAt)}</Text>
        </Table.Td>

        <Table.Td>
          <Badge color={getStatusColor(enquiry.status)} variant="light">
            {formatStatus(enquiry.status)}
          </Badge>
        </Table.Td>

        <Table.Td>
          <Tooltip label="View enquiry">
            <ActionIcon
              variant="light"
              color="dark"
              onClick={() => setSelectedEnquiry(enquiry)}
              aria-label="View enquiry"
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="lg">
      {/* Page heading */}
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Title order={2}>Customer Enquiries</Title>

          <Text size="sm" c="dimmed">
            Manage and follow up on customer vehicle enquiries.
          </Text>
        </Stack>
      </Group>

      {/* Statistics */}
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        <StatCard
          label="Total Enquiries"
          value={statsLoading ? 0 : stats.total}
          color="dark"
        />

        <StatCard
          label="New Enquiries"
          value={statsLoading ? 0 : stats.new}
          color="blue"
        />

        <StatCard
          label="In Discussion"
          value={statsLoading ? 0 : stats.inDiscussion}
          color="orange"
        />

        <StatCard
          label="Converted"
          value={statsLoading ? 0 : stats.converted}
          color="green"
        />
      </SimpleGrid>

      {/* Enquiries table */}
      <Paper withBorder radius="md" p="md">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Stack gap={3}>
              <Title order={4}>All Enquiries</Title>

              <Text size="xs" c="dimmed">
                Review customer requests and follow up accordingly.
              </Text>
            </Stack>

            <Text size="sm" c="dimmed">
              {enquiries.length} displayed
            </Text>
          </Group>

          {/* Search and filters */}
          <Group align="center" grow>
            <TextInput
              placeholder="Search name, email, phone or vehicle..."
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />

            <Select
              placeholder="Filter by status"
              data={statusOptions}
              value={status}
              onChange={handleStatusFilter}
              clearable
              searchable
              w={220}
            />
          </Group>

          {error && (
            <Paper bg="red.0" p="sm" radius="sm">
              <Group justify="space-between">
                <Text size="sm" c="red">
                  {error}
                </Text>

                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => setPage((current) => current)}
                >
                  Retry
                </Button>
              </Group>
            </Paper>
          )}

          {/* Table */}
          <Table.ScrollContainer minWidth={850}>
            <Table verticalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Vehicle</Table.Th>
                  <Table.Th>Enquiry Type</Table.Th>
                  <Table.Th>Date Received</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Stack align="center" py="xl">
                        <Loader size="sm" />

                        <Text size="sm" c="dimmed">
                          Loading enquiries...
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ) : enquiries.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Stack align="center" py="xl" gap={5}>
                        <Text fw={500}>No enquiries found</Text>

                        <Text size="sm" c="dimmed">
                          Try changing your search or status filter.
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  rows
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Group justify="flex-end">
              <Pagination total={totalPages} value={page} onChange={setPage} />
            </Group>
          )}
        </Stack>
      </Paper>

      <EnquiryDetails
        opened={selectedEnquiry !== null}
        enquiryId={selectedEnquiry?._id ?? null}
        onClose={() => setSelectedEnquiry(null)}
        onUpdated={() => setRefreshKey((current) => current + 1)}
      />
    </Stack>
  );
}
