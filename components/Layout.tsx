import { ReactNode } from "react";
import AppBar from "./AppBar";
import { Divider, Stack, Typography } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main>
      <AppBar />
      <Typography variant="h2" align="center" my={4}>
        AI Powered Travel Assistant
      </Typography>
      <Divider
        sx={{
          margin: "auto",
          width: "60%",
          marginTop: -2,
          marginBottom: 4,
        }}
      />
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Stack>
    </main>
  );
};

export default Layout;
