import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../features/auth/AuthContext";
import { theme } from "../theme/theme";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />

      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}
