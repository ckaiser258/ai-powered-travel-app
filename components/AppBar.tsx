import AuthButtons from "./users/AuthButtons";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "./Link";
import { useState } from "react";
import { Menu } from "@mui/icons-material";

const drawerWidth = 240;
const navLinks = [
  { title: `Home`, path: `/` },
  { title: `Common Phrases Generator`, path: `/common-phrases` },
  { title: `Language Exercise Generator`, path: `/exercises` },
  { title: `Translator`, path: `/` },
  {
    title: `Chat Bot 🤖`,
    path: `/chat-bot`,
  },
];

const AppBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} textAlign="center">
      <Typography variant="h6" sx={{ my: 2 }}>
        AI Powered Travel Assistant
      </Typography>
      <Divider variant="middle" />
      <List>
        {navLinks.map(({ title, path }, i) => (
          <ListItem
            key={i}
            disablePadding
            sx={{
              display: "block",
            }}
          >
            <Link href={path} underline="none" color="inherit">
              <ListItemButton sx={{ textAlign: "center" }} disableRipple>
                <ListItemText primary={title} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <ListItem
          disablePadding
          sx={{
            justifyContent: "center",
            mt: 1,
          }}
        >
          <AuthButtons />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar component="nav" position="sticky">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" flexGrow={1}>
            AI Powered Travel Assistant
          </Typography>
          <Box display={{ xs: "none", lg: "block" }}>
            {navLinks.map(({ title, path }, i) => (
              <Link
                underline="none"
                href={path}
                sx={{ color: "primary.contrastText", mx: 2 }}
                key={i}
              >
                {title}
              </Link>
            ))}
          </Box>
          <Box display={{ xs: "none", sm: "block" }}>
            <AuthButtons />
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default AppBar;
