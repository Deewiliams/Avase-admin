import { useState } from "react";
import {
//   Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCar, IconLock, IconMail } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { authService } from "../auth-service";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email address",

      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const response = await authService.login(values);

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Assumes loginUser returns { token, user }
      localStorage.setItem("avase_token", response.data.token);
      localStorage.setItem("avase_user", JSON.stringify(response.data.user));

      notifications.show({
        title: "Welcome to AVASE",
        message: "You have successfully signed in.",
        color: "green",
      });

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      notifications.show({
        title: "Authentication failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "Unable to sign in.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      mih="100vh"
      bg="#F5F6F7"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      py={40}
    >
      <Container size="xl" w="100%">
        <Paper
          radius="xl"
          shadow="xl"
          style={{ overflow: "hidden" }}
          withBorder
        >
          <Group gap={0} align="stretch">
            {/* Branding Panel */}
            <Box
              visibleFrom="md"
              w="50%"
              p={50}
              bg="#18242C"
              style={{
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 620,
              }}
            >
              <Box>
                <Group gap="sm">
                  <IconCar size={35} color="#B18C52" />
                  <Title order={2} c="white" fw={700}>
                    AVASE
                  </Title>
                </Group>

                <Text
                  c="#B18C52"
                  size="xs"
                  fw={700}
                  mt="xl"
                  style={{ letterSpacing: 3 }}
                >
                  PREMIUM VEHICLE SOURCING
                </Text>

                <Title order={1} mt={25} size={42} fw={600} lh={1.2} maw={420}>
                  Excellence in Every Journey.
                </Title>

                <Text c="gray.4" mt="lg" maw={380} lh={1.8}>
                  Manage your vehicle inventory, oversee customer enquiries and
                  deliver an exceptional vehicle sourcing experience.
                </Text>
              </Box>

              <Box
                h={220}
                style={{
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #263640, #111A20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCar size={130} color="#B18C52" stroke={1} />
              </Box>

              <Text c="dimmed" size="xs">
                © 2026 AVASE LIMITED. ALL RIGHTS RESERVED.
              </Text>
            </Box>

            {/* Login Form */}
            <Box
              flex={1}
              p={{ base: 25, sm: 45, lg: 65 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box w="100%" maw={400}>
                <Box hiddenFrom="md" mb={40}>
                  <Group gap="xs">
                    <IconCar size={32} color="#B18C52" />
                    <Title order={2} c="#18242C">
                      AVASE
                    </Title>
                  </Group>
                </Box>

                <Text
                  size="xs"
                  fw={700}
                  c="#B18C52"
                  style={{ letterSpacing: 2 }}
                >
                  ADMINISTRATION PORTAL
                </Text>

                <Title order={2} mt="sm" c="#18242C">
                  Welcome back
                </Title>

                <Text c="dimmed" size="sm" mt={7} mb={35}>
                  Sign in to access your administration dashboard.
                </Text>

                <form onSubmit={form.onSubmit(handleLogin)}>
                  <Stack gap="lg">
                    <TextInput
                      label="Email address"
                      placeholder="admin@avase.com"
                      leftSection={<IconMail size={17} />}
                      size="md"
                      {...form.getInputProps("email")}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      leftSection={<IconLock size={17} />}
                      size="md"
                      {...form.getInputProps("password")}
                    />

                    <Group justify="space-between">
                      <Checkbox label="Remember me" color="dark" size="sm" />
                    </Group>

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      color="dark"
                      loading={loading}
                      styles={{
                        root: {
                          backgroundColor: "#18242C",
                          "&:hover": {
                            backgroundColor: "#263640",
                          },
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </form>

                <Divider my={35} />

                <Text ta="center" size="xs" c="dimmed">
                  Secure access exclusively for authorised AVASE administrators.
                </Text>
              </Box>
            </Box>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
