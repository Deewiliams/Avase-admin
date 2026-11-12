import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";

import { enquiryService } from "./enquiry-service";

import type { Enquiry, EnquiryStatus } from "./enquiry-types";

interface EnquiryDetailsProps {
  opened: boolean;
  enquiryId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

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

const formatStatus = (status: EnquiryStatus) =>
  status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EnquiryDetails({
  opened,
  enquiryId,
  onClose,
  onUpdated,
}: EnquiryDetailsProps) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus | null>(
    null,
  );

  const [note, setNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load full enquiry details whenever the modal opens
  useEffect(() => {
    if (!opened || !enquiryId) return;

    let cancelled = false;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        setEnquiry(null);

        const response = await enquiryService.getEnquiryById(enquiryId);

        if (cancelled) return;

        setEnquiry(response.data);
        setSelectedStatus(response.data.status);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch enquiry details:", err);
        setError("Unable to load enquiry details. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [opened, enquiryId]);

  const handleStatusUpdate = async () => {
    if (!enquiry || !selectedStatus) return;

    if (selectedStatus === enquiry.status) {
      setError("Select a different status before updating.");
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      const response = await enquiryService.updateEnquiryStatus(enquiry._id, {
        status: selectedStatus,
      });

      setEnquiry(response.data);
      setSelectedStatus(response.data.status);
      setSuccess("Enquiry status updated successfully.");

      onUpdated?.();
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
      setError("Unable to update enquiry status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!enquiry) return;

    const trimmedNote = note.trim();

    if (!trimmedNote) {
      setError("Please enter a note before submitting.");
      return;
    }

    try {
      setAddingNote(true);
      setError("");
      setSuccess("");

      const response = await enquiryService.addEnquiryNote(enquiry._id, {
        note: trimmedNote,
      });

      setEnquiry(response.data);
      setNote("");
      setSuccess("Internal note added successfully.");

      onUpdated?.();
    } catch (err) {
      console.error("Failed to add internal note:", err);
      setError("Unable to add the note. Please try again.");
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Enquiry Details"
      centered
      size="xl"
      overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
    >
      {loading ? (
        <Stack align="center" justify="center" py="xl">
          <Loader />

          <Text size="sm" c="dimmed">
            Loading enquiry details...
          </Text>
        </Stack>
      ) : error && !enquiry ? (
        <Stack gap="md">
          <Text c="red" size="sm">
            {error}
          </Text>

          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </Stack>
      ) : enquiry ? (
        <Stack gap="lg">
          {/* Customer heading */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={3}>
              <Title order={3}>{enquiry.customerName}</Title>

              <Text size="xs" c="dimmed">
                Received {formatDateTime(enquiry.createdAt)}
              </Text>
            </Stack>

            <Badge
              size="lg"
              color={getStatusColor(enquiry.status)}
              variant="light"
            >
              {formatStatus(enquiry.status)}
            </Badge>
          </Group>

          {error && (
            <Paper bg="red.0" p="sm" radius="sm">
              <Text size="sm" c="red">
                {error}
              </Text>
            </Paper>
          )}

          {success && (
            <Paper bg="green.0" p="sm" radius="sm">
              <Text size="sm" c="green">
                {success}
              </Text>
            </Paper>
          )}

          <Divider />

          {/* Customer contact information */}
          <Stack gap="xs">
            <Title order={5}>Customer Information</Title>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Full name
              </Text>
              <Text size="sm" fw={500}>
                {enquiry.customerName}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Phone
              </Text>
              <Text size="sm" fw={500}>
                {enquiry.phone}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text size="sm" fw={500}>
                {enquiry.email || "Not provided"}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Preferred contact
              </Text>
              <Text size="sm" fw={500}>
                {enquiry.preferredContactMethod}
              </Text>
            </Group>
          </Stack>

          <Divider />

          {/* Vehicle information */}
          <Stack gap="xs">
            <Title order={5}>Vehicle Information</Title>

            <Text size="sm" fw={600}>
              {enquiry.vehicleSnapshot.year} {enquiry.vehicleSnapshot.make}{" "}
              {enquiry.vehicleSnapshot.model}
            </Text>

            {enquiry.vehicle && (
              <>
                {enquiry.vehicle.price !== undefined && (
                  <Text size="sm" c="dimmed">
                    Price: {enquiry.vehicle.currency || ""}{" "}
                    {enquiry.vehicle.price.toLocaleString()}
                  </Text>
                )}

                {enquiry.vehicle.images?.[0]?.url && (
                  <img
                    src={enquiry.vehicle.images[0].url}
                    alt={`${enquiry.vehicleSnapshot.make} ${enquiry.vehicleSnapshot.model}`}
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </>
            )}

            <Text size="xs" c="dimmed">
              Enquiry type: {enquiry.enquiryType.split("_").join(" ")}
            </Text>
          </Stack>

          <Divider />

          {/* Customer message */}
          <Stack gap="xs">
            <Title order={5}>Customer Message</Title>

            <Paper withBorder radius="md" p="md">
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {enquiry.message}
              </Text>
            </Paper>
          </Stack>

          <Divider />

          {/* Status management */}
          <Stack gap="sm">
            <Title order={5}>Manage Enquiry</Title>

            <Select
              label="Enquiry status"
              data={statusOptions}
              value={selectedStatus}
              onChange={(value) =>
                setSelectedStatus(value as EnquiryStatus | null)
              }
              allowDeselect={false}
            />

            <Group justify="flex-end">
              <Button
                onClick={handleStatusUpdate}
                loading={updatingStatus}
                disabled={!selectedStatus || selectedStatus === enquiry.status}
              >
                Update Status
              </Button>
            </Group>
          </Stack>

          <Divider />

          {/* Internal notes */}
          <Stack gap="sm">
            <Title order={5}>Internal Notes</Title>

            <Text size="xs" c="dimmed">
              These notes are visible to administrators only.
            </Text>

            <Textarea
              placeholder="Write an internal follow-up note..."
              minRows={3}
              autosize
              value={note}
              onChange={(event) => setNote(event.currentTarget.value)}
            />

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={handleAddNote}
                loading={addingNote}
                disabled={!note.trim()}
              >
                Add Note
              </Button>
            </Group>

            {enquiry.internalNotes?.length ? (
              <Stack gap="sm">
                {enquiry.internalNotes.map((item, index) => (
                  <Paper
                    key={item._id || `${item.createdAt}-${index}`}
                    withBorder
                    radius="md"
                    p="sm"
                  >
                    <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                      {item.note}
                    </Text>

                    <Group justify="space-between" mt="xs">
                      <Text size="xs" fw={500} c="dimmed">
                        {item.createdBy?.name || "Administrator"}
                      </Text>

                      <Text size="xs" c="dimmed">
                        {formatDateTime(item.createdAt)}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                No internal notes have been added yet.
              </Text>
            )}
          </Stack>

          <Divider />

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </Group>
        </Stack>
      ) : null}
    </Modal>
  );
}
