
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 76 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
      styles={{
        main: {
          backgroundColor: "#F5F6F7",
          minHeight: "100vh",
        },
      }}
    >
      <AppShell.Header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E9ECEF",
        }}
      >
        <Header opened={opened} onToggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar
        p="lg"
        style={{
          backgroundColor: "#18242C",
          borderRight: "none",
        }}
      >
        <Sidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={1600} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
