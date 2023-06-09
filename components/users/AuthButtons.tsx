import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import { Box, Typography } from "@mui/material";

const AuthButtons = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // This will ensure that the HTML rendered on the client matches the HTML rendered on the server after login/logout
  }, []);

  return status === "authenticated" ? (
    <Box display="inline-flex">
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          display: {
            xs: "none",
            xl: "inline-flex",
          },
          alignItems: "center",
        }}
      >
        {/* Temporary hack to get the user's first name. As this isn't currently an option within the user object. */}
        Hello, {session?.user?.name.split(" ")[0]}
      </Typography>
      <Box ml={{ lg: 2 }}>
        <LogoutForm />
      </Box>
    </Box>
  ) : (
    <LoginForm />
  );
};

export default AuthButtons;
