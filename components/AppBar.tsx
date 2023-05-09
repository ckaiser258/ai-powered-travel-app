import AuthButtons from "./users/AuthButtons";
import { Box, AppBar as MuiAppBar, Toolbar } from "@mui/material";
import Link from "./Link";

const AppBar: React.FC = () => {
  return (
    <MuiAppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Link href="/" color="inherit" underline="none">
            Home
          </Link>
        </Box>
        <Link href="/common-phrases" color="inherit" underline="none">
          Common Phrases Generator
        </Link>
        <Link href="/exercises" color="inherit" underline="none">
          Language Exercise Generator
        </Link>
        <Link href="/" color="inherit" underline="none">
          Translator
        </Link>
        <Link href="/chat-bot" color="inherit" underline="none">
          Got other questions about travel? Ask our Chat Bot!
        </Link>
        <AuthButtons />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
