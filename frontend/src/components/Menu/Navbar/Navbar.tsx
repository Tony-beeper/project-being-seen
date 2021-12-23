import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SignupIcon from "@mui/icons-material/ArrowForward";

import { decodeAuthToken } from "utils/authHelpers";
import UserRoles from "utils/UserRoles";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  onLogout: () => any;
}

// Render desktop menu based on account role (or defaults if not logged in)
const Navbar = ({ onLogout }: NavbarProps) => {
  const account = decodeAuthToken();

  return (
    <div className={styles.wrapper}>
      {account ? (
        <>
          {account.role === UserRoles.donor && (
            <Button to="/" component={Link} color="inherit">
              Youths
            </Button>
          )}
          {account.role === UserRoles.youth && (
            <Button to="/store" component={Link} color="inherit">
              Store
            </Button>
          )}
          <Button to="/dashboard" component={Link} color="inherit">
            Dashboard
          </Button>
          <Button to="/profile" component={Link} color="inherit">
            Profile
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            to="/login"
            component={Link}
            variant="outlined"
            color="inherit"
            endIcon={<LoginIcon />}
          >
            Login
          </Button>
          <Button
            to="/signup"
            component={Link}
            variant="outlined"
            color="inherit"
            endIcon={<SignupIcon />}
          >
            Signup
          </Button>
        </>
      )}
    </div>
  );
};

export default Navbar;
