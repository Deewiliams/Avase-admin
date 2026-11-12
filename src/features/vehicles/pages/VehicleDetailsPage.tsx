
import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCar,
  IconChartFunnel,
  IconEdit,
  IconEngine,
  IconEye,
  IconEyeOff,
//   IconFuel,
  IconGauge,
  IconMapPin,
  IconRefresh,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";

import { useNavigate, useParams } from "react-router-dom";
import { vehicleService } from "../vehicle-service";
import type { Vehicle } from "../vehicle-types";

const formatLabel = (value?: string) => {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: "gray",
    AVAILABLE: "green",
    RESERVED: "orange",
    SOLD: "red",
    ARCHIVED: "dark",
  };

  return colors[status] ?? "gray";
};

interface SpecificationProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Specification({
  icon,
  label,
  value,
}: SpecificationProps) {
  return (
    <Group align="center" gap="sm" wrap="nowrap">
      <Center
        w={40}
        h={40}
        bg="gray.0"
        style={{ borderRadius: 8 }}
      >
        {icon}
      </Center>

      <Box>
        <Text size="xs" c="dimmed">
          {label}
        </Text>

        <Text size="sm" fw={600}>
          {value}
        </Text>
      </Box>
    </Group>
  );
}

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicle = async () => {
    if (!id) {
      setError("Vehicle ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await vehicleService.getVehicleById(id);

      if (!response.success || !response.data?.vehicle) {
        throw new Error("Unable to retrieve vehicle details.");
      }

      setVehicle(response.data.vehicle);
      setSelectedImage(0);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load vehicle details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <Center py={100}>
        <Stack align="center" gap="sm">
          <Loader color="dark" size="lg" />
          <Text size="sm" c="dimmed">
            Loading vehicle details...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (error || !vehicle) {
    return (
      <Stack gap="lg">
        <Button
          variant="subtle"
          color="dark"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate("/vehicles")}
          w="fit-content"
        >
          Back to vehicles
        </Button>

        <Alert
          color="red"
          icon={<IconAlertCircle size={18} />}
          title="Unable to load vehicle"
        >
          {error || "Vehicle could not be found."}
        </Alert>

        <Button
          leftSection={<IconRefresh size={16} />}
          variant="light"
          color="dark"
          onClick={fetchVehicle}
          w="fit-content"
        >
          Try again
        </Button>
      </Stack>
    );
  }

  const images = vehicle.images ?? [];
  const currentImage = images[selectedImage];

  return (
    <Stack gap="xl">
      {/* Page Header */}
      <Group justify="space-between" align="center">
        <Box>
          <Button
            variant="subtle"
            color="dark"
            size="compact-sm"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/vehicles")}
            mb="sm"
          >
            Back to vehicles
          </Button>

          <Title order={2} c="dark.8">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Title>

          <Text size="sm" c="dimmed" mt={4}>
            Vehicle inventory / Vehicle details
          </Text>
        </Box>

        <Button
          leftSection={<IconEdit size={16} />}
          color="dark"
          onClick={() =>
            navigate(`/vehicles/${vehicle._id}/edit`)
          }
        >
          Edit vehicle
        </Button>
      </Group>

      {/* Main Vehicle Information */}
      <Grid gutter="xl">
        {/* Image Gallery */}
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper withBorder p="md" radius="lg">
            <Box
              bg="gray.0"
              style={{
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {currentImage?.url ? (
                <Image
                  src={currentImage.url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  h={420}
                  fit="contain"
                  fallbackSrc="https://placehold.co/800x500?text=Vehicle+Image"
                />
              ) : (
                <Center h={420}>
                  <Stack align="center" gap="xs">
                    <IconCar size={48} color="gray" />
                    <Text c="dimmed" size="sm">
                      No vehicle images available
                    </Text>
                  </Stack>
                </Center>
              )}
            </Box>

            {images.length > 0 && (
              <SimpleGrid cols={{ base: 4, sm: 5 }} mt="md">
                {images.map((image, index) => (
                  <Box
                    key={image.publicId || image.url}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      cursor: "pointer",
                      border:
                        selectedImage === index
                          ? "2px solid #B18C52"
                          : "2px solid transparent",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={`Vehicle image ${index + 1}`}
                      h={75}
                      fit="cover"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}

            <Text size="xs" c="dimmed" mt="sm">
              {images.length} vehicle image
              {images.length === 1 ? "" : "s"}
            </Text>
          </Paper>
        </Grid.Col>

        {/* Pricing and Status */}
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper withBorder p="xl" radius="lg">
            <Stack gap="lg">
              <Group justify="space-between">
                <Badge
                  color={getStatusColor(vehicle.status)}
                  variant="light"
                  size="lg"
                >
                  {formatLabel(vehicle.status)}
                </Badge>

                {vehicle.isFeatured && (
                  <Badge
                    color="yellow"
                    variant="light"
                    leftSection={<IconStar size={12} />}
                  >
                    Featured
                  </Badge>
                )}
              </Group>

              <Box>
                <Text size="sm" c="dimmed">
                  Asking price
                </Text>

                <Title order={1} c="dark.8" mt={5}>
                  {formatPrice(vehicle.price, vehicle.currency)}
                </Title>
              </Box>

              <Divider />

              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Publication
                  </Text>

                  <Badge
                    color={vehicle.isPublished ? "green" : "gray"}
                    variant="light"
                    leftSection={
                      vehicle.isPublished
                        ? <IconEye size={12} />
                        : <IconEyeOff size={12} />
                    }
                  >
                    {vehicle.isPublished ? "Published" : "Unpublished"}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Condition
                  </Text>
                  <Text size="sm" fw={600}>
                    {formatLabel(vehicle.condition)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Location
                  </Text>
                  <Text size="sm" fw={600}>
                    {vehicle.location || "Not specified"}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    VIN
                  </Text>
                  <Text size="sm" fw={600}>
                    {vehicle.vin || "Not provided"}
                  </Text>
                </Group>
              </Stack>

              <Divider />

              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Date added
                </Text>

                <Text size="sm" fw={500}>
                  {new Date(vehicle.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Text>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Specifications */}
      <Paper withBorder p="xl" radius="lg">
        <Title order={4} mb="lg">
          Vehicle specifications
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          <Specification
            icon={<IconCalendar size={20} color="#B18C52" />}
            label="Year"
            value={String(vehicle.year)}
          />

          <Specification
            icon={<IconGauge size={20} color="#B18C52" />}
            label="Mileage"
            value={`${vehicle.mileage.toLocaleString()} km`}
          />

          <Specification
            icon={<IconSettings size={20} color="#B18C52" />}
            label="Transmission"
            value={formatLabel(vehicle.transmission)}
          />

          <Specification
            icon={<IconChartFunnel size={20} color="#B18C52" />}
            label="Fuel type"
            value={formatLabel(vehicle.fuelType)}
          />

          <Specification
            icon={<IconEngine size={20} color="#B18C52" />}
            label="Engine capacity"
            value={vehicle.engineCapacity || "Not specified"}
          />

          <Specification
            icon={<IconCar size={20} color="#B18C52" />}
            label="Body type"
            value={formatLabel(vehicle.bodyType)}
          />

          <Specification
            icon={<IconSettings size={20} color="#B18C52" />}
            label="Drive type"
            value={formatLabel(vehicle.driveType)}
          />

          <Specification
            icon={<IconCar size={20} color="#B18C52" />}
            label="Exterior colour"
            value={vehicle.exteriorColor || "Not specified"}
          />

          <Specification
            icon={<IconCar size={20} color="#B18C52" />}
            label="Interior colour"
            value={vehicle.interiorColor || "Not specified"}
          />
        </SimpleGrid>
      </Paper>

      {/* Description */}
      <Paper withBorder p="xl" radius="lg">
        <Title order={4} mb="md">
          Vehicle description
        </Title>

        <Text size="sm" c="gray.7" style={{ lineHeight: 1.8 }}>
          {vehicle.description}
        </Text>
      </Paper>

      {/* Features */}
      <Paper withBorder p="xl" radius="lg">
        <Title order={4} mb="lg">
          Vehicle features
        </Title>

        {vehicle.features?.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {vehicle.features.map((feature, index) => (
              <Group key={`${feature}-${index}`} gap="xs">
                <Center
                  w={24}
                  h={24}
                  bg="gray.1"
                  style={{ borderRadius: 50 }}
                >
                  <IconStar size={13} color="#B18C52" />
                </Center>

                <Text size="sm">{feature}</Text>
              </Group>
            ))}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">
            No additional features have been added.
          </Text>
        )}
      </Paper>

      {/* Record Information */}
      <Paper withBorder p="xl" radius="lg">
        <Title order={4} mb="md">
          Record information
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Box>
            <Text size="xs" c="dimmed">
              Created
            </Text>
            <Text size="sm" fw={500}>
              {new Date(vehicle.createdAt).toLocaleString()}
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed">
              Last updated
            </Text>
            <Text size="sm" fw={500}>
              {new Date(vehicle.updatedAt).toLocaleString()}
            </Text>
          </Box>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
