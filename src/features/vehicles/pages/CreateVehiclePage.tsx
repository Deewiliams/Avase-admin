
import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  FileInput,
  Grid,
  Group,
  Image,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconCloudUpload,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";

import { vehicleService } from "../vehicle-service";
import type {
  Vehicle,
  VehicleBodyType,
  VehicleCondition,
  VehicleCurrency,
  VehicleDriveType,
  VehicleFuelType,
  VehicleStatus,
  VehicleTransmission,
} from "../vehicle-types";

interface VehicleFormValues {
  make: string;
  model: string;
  year: number | string;
  vin: string;
  price: number | string;
  currency: VehicleCurrency;
  mileage: number | string;
  transmission: VehicleTransmission | "";
  fuelType: VehicleFuelType | "";
  engineCapacity: string;
  bodyType: VehicleBodyType | "";
  condition: VehicleCondition | "";
  exteriorColor: string;
  interiorColor: string;
  driveType: VehicleDriveType | "";
  location: string;
  description: string;
  status: VehicleStatus;
  isPublished: boolean;
  isFeatured: boolean;
}

const makeOptions = [
  "Toyota", "Mercedes-Benz", "BMW", "Audi", "Lexus",
  "Land Rover", "Range Rover", "Porsche", "Volkswagen",
  "Honda", "Nissan", "Mazda", "Ford", "Jeep",
  "Hyundai", "Kia", "Other",
].map((value) => ({ value, label: value }));

const transmissionOptions = [
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
  { value: "CVT", label: "CVT" },
  { value: "OTHER", label: "Other" },
];

const fuelOptions = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "OTHER", label: "Other" },
];

const bodyOptions = [
  "SUV", "SEDAN", "HATCHBACK", "COUPE", "PICKUP",
  "TRUCK", "VAN", "WAGON", "OTHER",
].map((value) => ({ value, label: value }));

const conditionOptions = [
  { value: "BRAND_NEW", label: "Brand New" },
  { value: "FOREIGN_USED", label: "Foreign Used" },
  { value: "LOCALLY_USED", label: "Locally Used" },
];

const driveOptions = [
  { value: "FWD", label: "Front Wheel Drive (FWD)" },
  { value: "RWD", label: "Rear Wheel Drive (RWD)" },
  { value: "AWD", label: "All Wheel Drive (AWD)" },
  { value: "4WD", label: "Four Wheel Drive (4WD)" },
  { value: "OTHER", label: "Other" },
];

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "ARCHIVED", label: "Archived" },
];

const initialValues: VehicleFormValues = {
  make: "",
  model: "",
  year: "",
  vin: "",
  price: "",
  currency: "ZMW",
  mileage: "",
  transmission: "",
  fuelType: "",
  engineCapacity: "",
  bodyType: "",
  condition: "",
  exteriorColor: "",
  interiorColor: "",
  driveType: "",
  location: "",
  description: "",
  status: "DRAFT",
  isPublished: false,
  isFeatured: false,
};

export default function EditVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [existingImages, setExistingImages] = useState<
    Vehicle["images"]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<VehicleFormValues>({
    initialValues,
    validate: {
      make: (value) =>
        value.trim().length < 2 ? "Enter vehicle make" : null,
      model: (value) =>
        !value.trim() ? "Enter vehicle model" : null,
      year: (value) => {
        const year = Number(value);
        return !Number.isInteger(year) || year < 1900
          ? "Enter a valid manufacturing year"
          : null;
      },
      price: (value) =>
        value === "" || !Number.isFinite(Number(value)) ||
        Number(value) < 0
          ? "Enter a valid price"
          : null,
      mileage: (value) =>
        value === "" || !Number.isFinite(Number(value)) ||
        Number(value) < 0
          ? "Enter valid mileage"
          : null,
      transmission: (value) =>
        !value ? "Select transmission" : null,
      fuelType: (value) =>
        !value ? "Select fuel type" : null,
      bodyType: (value) =>
        !value ? "Select body type" : null,
      condition: (value) =>
        !value ? "Select vehicle condition" : null,
      description: (value) =>
        value.trim().length < 10
          ? "Description must contain at least 10 characters"
          : null,
    },
  });

  // Load the vehicle and populate the form.
  useEffect(() => {
    let active = true;

    const loadVehicle = async () => {
      if (!id) {
        setSubmitError("Vehicle ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await vehicleService.getVehicleById(id);

        if (!response.success || !response.data?.vehicle) {
          throw new Error(response.message || "Unable to load vehicle.");
        }

        const data: Vehicle = response.data.vehicle;

        if (!active) return;

        setVehicle(data);
        setExistingImages(data.images ?? []);
        setFeatures(data.features ?? []);

        form.setValues({
          make: data.make ?? "",
          model: data.model ?? "",
          year: data.year ?? "",
          vin: data.vin ?? "",
          price: data.price ?? "",
          currency: data.currency ?? "ZMW",
          mileage: data.mileage ?? "",
          transmission: data.transmission ?? "",
          fuelType: data.fuelType ?? "",
          engineCapacity: data.engineCapacity ?? "",
          bodyType: data.bodyType ?? "",
          condition: data.condition ?? "",
          exteriorColor: data.exteriorColor ?? "",
          interiorColor: data.interiorColor ?? "",
          driveType: data.driveType ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          status: data.status ?? "DRAFT",
          isPublished: data.isPublished ?? false,
          isFeatured: data.isFeatured ?? false,
        });
      } catch (error: any) {
        if (!active) return;

        setSubmitError(
          error.response?.data?.message ||
          error.message ||
          "Unable to load vehicle."
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  // Create and clean up previews for newly selected files.
  useEffect(() => {
    const previews = newImages.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    if (
      features.some(
        (feature) => feature.toLowerCase() === value.toLowerCase()
      )
    ) {
      setFeatureInput("");
      return;
    }

    setFeatures((current) => [...current, value]);
    setFeatureInput("");
  };

  const removeFeature = (feature: string) => {
    setFeatures((current) =>
      current.filter((item) => item !== feature)
    );
  };

  const removeExistingImage = (publicId: string) => {
    setExistingImages((current) =>
      current.filter((image) => image.publicId !== publicId)
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!id || !vehicle) return;

    setSubmitError("");

    if (existingImages.length + newImages.length === 0) {
      setSubmitError("A vehicle must have at least one image.");
      return;
    }

    if (features.length === 0) {
      setSubmitError("Please add at least one vehicle feature.");
      return;
    }

    const formData = new FormData();

    formData.append("make", values.make.trim());
    formData.append("model", values.model.trim());
    formData.append("year", String(values.year));
    formData.append("price", String(values.price));
    formData.append("currency", values.currency);
    formData.append("mileage", String(values.mileage));
    formData.append("transmission", values.transmission);
    formData.append("fuelType", values.fuelType);
    formData.append("bodyType", values.bodyType);
    formData.append("condition", values.condition);
    formData.append("description", values.description.trim());

    formData.append("features", JSON.stringify(features));

    // Tell the backend which existing images should remain.
    formData.append(
      "keepImagePublicIds",
      JSON.stringify(existingImages.map((image) => image.publicId))
    );

    if (values.vin.trim()) {
      formData.append("vin", values.vin.trim().toUpperCase());
    }

    if (values.engineCapacity.trim()) {
      formData.append("engineCapacity", values.engineCapacity.trim());
    }

    if (values.exteriorColor.trim()) {
      formData.append("exteriorColor", values.exteriorColor.trim());
    }

    if (values.interiorColor.trim()) {
      formData.append("interiorColor", values.interiorColor.trim());
    }

    if (values.driveType) {
      formData.append("driveType", values.driveType);
    }

    if (values.location.trim()) {
      formData.append("location", values.location.trim());
    }

    formData.append("status", values.status);
    formData.append("isPublished", String(values.isPublished));
    formData.append("isFeatured", String(values.isFeatured));

    // Only newly selected images are uploaded.
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setIsSubmitting(true);

      const response = await vehicleService.updateVehicle(
        id,
        formData
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update vehicle.");
      }

      notifications.show({
        title: "Vehicle updated",
        message: response.message || "Vehicle details updated successfully.",
        color: "green",
        icon: <IconCheck size={18} />,
      });

      navigate(`/vehicles/${id}`);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the vehicle.";

      setSubmitError(message);

      notifications.show({
        title: "Unable to update vehicle",
        message,
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Paper p="xl" radius="lg" withBorder>
        <Text c="dimmed" ta="center">Loading vehicle details...</Text>
      </Paper>
    );
  }

  if (!vehicle) {
    return (
      <Stack gap="md">
        <Alert color="red" icon={<IconAlertCircle size={18} />}>
          {submitError || "Vehicle could not be found."}
        </Alert>
        <Button
          variant="default"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate("/vehicles")}
        >
          Back to vehicles
        </Button>
      </Stack>
    );
  }

  if (vehicle.status === "ARCHIVED") {
    return (
      <Stack gap="md">
        <Alert color="orange" title="Archived vehicle">
          Archived vehicles cannot be edited.
        </Alert>
        <Button
          variant="default"
          onClick={() => navigate(`/vehicles/${vehicle._id}`)}
        >
          Back to vehicle details
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group gap="sm">
          <ActionIcon
            variant="subtle"
            color="dark"
            size="lg"
            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
            aria-label="Back to vehicle details"
          >
            <IconArrowLeft size={20} />
          </ActionIcon>

          <Box>
            <Text size="xs" fw={700} c="#B18C52">
              INVENTORY MANAGEMENT
            </Text>
            <Title order={2} c="#18242C">
              Edit Vehicle
            </Title>
            <Text size="sm" c="dimmed">
              Update {vehicle.make} {vehicle.model} details.
            </Text>
          </Box>
        </Group>

        <Badge color="gold" variant="light" size="lg">
          Editing Listing
        </Badge>
      </Group>

      {submitError && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={18} />}
          withCloseButton
          onClose={() => setSubmitError("")}
        >
          {submitError}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Paper p="lg" radius="lg" withBorder>
            <Title order={4} mb="lg" c="#18242C">
              Vehicle Information
            </Title>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Make"
                  data={makeOptions}
                  searchable
                  {...form.getInputProps("make")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Model"
                  {...form.getInputProps("model")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Manufacturing Year"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  allowDecimal={false}
                  {...form.getInputProps("year")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="Condition"
                  data={conditionOptions}
                  {...form.getInputProps("condition")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="VIN / Chassis Number"
                  {...form.getInputProps("vin")}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Title order={4} mb="lg" c="#18242C">
              Vehicle Specifications
            </Title>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Body Type"
                  data={bodyOptions}
                  {...form.getInputProps("bodyType")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Transmission"
                  data={transmissionOptions}
                  {...form.getInputProps("transmission")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Fuel Type"
                  data={fuelOptions}
                  {...form.getInputProps("fuelType")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Drive Type"
                  data={driveOptions}
                  clearable
                  {...form.getInputProps("driveType")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Engine Capacity"
                  {...form.getInputProps("engineCapacity")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Mileage (km)"
                  min={0}
                  allowDecimal={false}
                  {...form.getInputProps("mileage")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Exterior Colour"
                  {...form.getInputProps("exteriorColor")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Interior Colour"
                  {...form.getInputProps("interiorColor")}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Title order={4} mb="lg" c="#18242C">
              Pricing & Location
            </Title>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="Currency"
                  data={[
                    { value: "ZMW", label: "ZMW — Zambian Kwacha" },
                    { value: "USD", label: "USD — US Dollar" },
                  ]}
                  {...form.getInputProps("currency")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 8 }}>
                <NumberInput
                  label="Vehicle Price"
                  min={0}
                  allowNegative={false}
                  thousandSeparator=","
                  {...form.getInputProps("price")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label="Vehicle Location"
                  placeholder="e.g. Lusaka, Zambia"
                  {...form.getInputProps("location")}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Title order={4} mb="lg" c="#18242C">
              Description & Features
            </Title>

            <Stack gap="md">
              <Textarea
                label="Vehicle Description"
                minRows={5}
                autosize
                {...form.getInputProps("description")}
              />

              <Box>
                <Text fw={600} size="sm" mb="sm">
                  Vehicle Features
                </Text>

                <Group align="flex-end">
                  <TextInput
                    style={{ flex: 1 }}
                    placeholder="Enter a vehicle feature"
                    value={featureInput}
                    onChange={(event) =>
                      setFeatureInput(event.currentTarget.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addFeature();
                      }
                    }}
                  />

                  <Button
                    type="button"
                    color="dark"
                    leftSection={<IconPlus size={16} />}
                    onClick={addFeature}
                  >
                    Add
                  </Button>
                </Group>

                <Group mt="md" gap="xs">
                  {features.map((feature) => (
                    <Badge
                      key={feature}
                      size="lg"
                      variant="light"
                      color="gray"
                      rightSection={
                        <ActionIcon
                          size="xs"
                          color="gray"
                          variant="transparent"
                          onClick={() => removeFeature(feature)}
                          aria-label={`Remove ${feature}`}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      }
                    >
                      {feature}
                    </Badge>
                  ))}
                </Group>
              </Box>
            </Stack>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Group gap="sm" mb="xs">
              <IconCloudUpload color="#B18C52" size={22} />
              <Title order={4} c="#18242C">
                Vehicle Images
              </Title>
            </Group>

            <Text size="xs" c="dimmed" mb="lg">
              Remove images you no longer want, or upload additional images.
            </Text>

            {existingImages.length > 0 && (
              <>
                <Text fw={600} size="sm" mb="sm">
                  Existing Images ({existingImages.length})
                </Text>

                <SimpleGrid
                  cols={{ base: 2, sm: 3, md: 4 }}
                  spacing="sm"
                  mb="lg"
                >
                  {existingImages.map((image, index) => (
                    <Box key={image.publicId} pos="relative">
                      <Image
                        src={image.url}
                        h={125}
                        radius="md"
                        fit="cover"
                      />

                      <ActionIcon
                        pos="absolute"
                        top={6}
                        right={6}
                        color="red"
                        variant="filled"
                        size="sm"
                        onClick={() =>
                          removeExistingImage(image.publicId)
                        }
                        aria-label={`Remove existing image ${index + 1}`}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>

                      {index === 0 && newImages.length === 0 && (
                        <Badge
                          pos="absolute"
                          bottom={6}
                          left={6}
                          color="dark"
                        >
                          Main image
                        </Badge>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </>
            )}

            <FileInput
              label="Upload additional images"
              placeholder="Choose images from your device"
              accept="image/*"
              multiple
              clearable
              value={newImages}
              onChange={setNewImages}
              leftSection={<IconCloudUpload size={17} />}
            />

            {imagePreviews.length > 0 && (
              <>
                <Text fw={600} size="sm" mt="lg" mb="sm">
                  New Images ({newImages.length})
                </Text>

                <SimpleGrid
                  cols={{ base: 2, sm: 3, md: 4 }}
                  spacing="sm"
                >
                  {imagePreviews.map((preview, index) => (
                    <Box key={preview} pos="relative">
                      <Image
                        src={preview}
                        h={125}
                        radius="md"
                        fit="cover"
                      />

                      <ActionIcon
                        pos="absolute"
                        top={6}
                        right={6}
                        color="red"
                        variant="filled"
                        size="sm"
                        onClick={() => removeNewImage(index)}
                        aria-label={`Remove new image ${index + 1}`}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Box>
                  ))}
                </SimpleGrid>
              </>
            )}

            <Text size="xs" c="dimmed" mt="sm">
              At least one image must remain attached to the vehicle.
            </Text>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Title order={4} mb="lg" c="#18242C">
              Listing Settings
            </Title>

            <Stack gap="md">
              <Select
                label="Vehicle Status"
                data={statusOptions}
                {...form.getInputProps("status")}
              />

              <Switch
                label="Publish vehicle"
                description="Make this vehicle visible to clients, subject to your public listing rules."
                color="dark"
                {...form.getInputProps("isPublished", {
                  type: "checkbox",
                })}
              />

              <Switch
                label="Feature this vehicle"
                color="dark"
                {...form.getInputProps("isFeatured", {
                  type: "checkbox",
                })}
              />
            </Stack>
          </Paper>

          <Paper
            p="md"
            radius="lg"
            withBorder
            style={{
              position: "sticky",
              bottom: 12,
              zIndex: 5,
              backgroundColor: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                type="button"
                onClick={() => navigate(`/vehicles/${vehicle._id}`)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                color="dark"
                leftSection={<IconCheck size={17} />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </Group>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
}
