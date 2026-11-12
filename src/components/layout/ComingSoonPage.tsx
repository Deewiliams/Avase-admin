
import { Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconTools } from "@tabler/icons-react";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <Paper
      p="xl"
      radius="lg"
      withBorder
      style={{
        borderColor: "#E9ECEF",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Stack align="center" justify="center" py={70} gap="sm">
        <ThemeIcon size={60} radius="xl" color="gold" variant="light">
          <IconTools size={28} />
        </ThemeIcon>

        <Title order={3} c="#18242C">
          {title}
        </Title>

        <Text size="sm" c="dimmed" ta="center" maw={400}>
          {description}
        </Text>

        <Text size="xs" c="#B18C52" fw={600}>
          MODULE UNDER DEVELOPMENT
        </Text>
      </Stack>
    </Paper>
  );
}
