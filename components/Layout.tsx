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
      <Stack display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Typography variant="h2" align="center" mb={4}>
          AI Powered Travel Assistant
        </Typography>
        <Divider
          sx={{
            m: "auto",
            width: "60%",
            mt: -2,
            mb: 5,
          }}
        />
        {children}
      </Stack>
    </main>
  );
};

export default Layout;
