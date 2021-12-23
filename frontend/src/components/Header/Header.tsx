import { useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import BeingSeenLogo from "images/being-seen-logo.svg";

import Drawer from "components/Menu/Drawer";
import Navbar from "components/Menu/Navbar";

import { removeAuthToken } from "utils/authHelpers";
import styles from "./Header.module.scss";

// Render the header to be included on every page (it also manages the
// rendering of desktop and mobile menu components).
const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  // Remove the JWT token from local storage and refresh to make sure page is
  // rendered again (page can decide whether to redirect unauthorized user).
  const handleLogout = () => {
    removeAuthToken();
    window.location.reload();
  };

  return (
    <AppBar position="sticky">
      <Toolbar className={styles.wrapper}>
        <MuiLink to="/" component={Link} className={styles.logoLink}>
          <img src={BeingSeenLogo} alt="Being Seen" />
        </MuiLink>
        <div>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Navbar onLogout={handleLogout} />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton onClick={openDrawer} color="inherit">
              <MenuIcon />
            </IconButton>
            <Drawer
              open={drawerOpen}
              onClose={closeDrawer}
              onLogout={handleLogout}
            />
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
