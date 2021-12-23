import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoginIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import Layout from "components/Layout";
import { decodeAuthToken, setAuthToken } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import UserRoles from "utils/UserRoles";
import axiosBase from "utils/axiosBase";

import styles from "./LoginPage.module.scss";

// Render the login page + login form of the application. If a user is already
// logged in, they are redirected to the homepage.
const LoginPage = () => {
  const history = useHistory();
  const account = decodeAuthToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  if (account) {
    history.push("/");
  }

  // Sends a post request to backend API to check if credentials are valid
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axiosBase
      .post("/user/login", {
        username: username,
        password: password,
        remember: rememberMe,
      })
      .then((response) => {
        // On success, we store the JWT token returned and redirect the existing
        // user to their respective page (e.g., youths redirected to /store)
        setAuthToken(response.data.jwt);
        const loggedInAccount = decodeAuthToken();
        switch (loggedInAccount && loggedInAccount.role) {
          case UserRoles.donor:
            history.push("/");
            break;
          case UserRoles.merchant:
            history.push("/dashboard");
            break;
          case UserRoles.youth:
            history.push("/store");
            break;
        }
      })
      .catch(({ response }) => {
        handleResponseError(response);
      });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleRememberChange = (event: React.SyntheticEvent, state: boolean) =>
    setRememberMe(state);

  return (
    <Layout title="Login">
      <Container maxWidth="xs">
        <div className={styles.loginContainer}>
          <Avatar sx={{ mb: 2, bgcolor: "primary.main" }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            noValidate
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 1 }}
          >
            <TextField
              autoFocus
              required
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
              label="Username"
              margin="normal"
            />
            <TextField
              required
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              label="Password"
              type="password"
              margin="normal"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              checked={rememberMe}
              onChange={handleRememberChange}
              label="Remember me"
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Typography align="center" variant="body2">
              Don't have an account?
              <MuiLink to="/signup" component={Link} sx={{ ml: 1 }}>
                Signup
              </MuiLink>
            </Typography>
          </Box>
        </div>
      </Container>
    </Layout>
  );
};

export default LoginPage;
