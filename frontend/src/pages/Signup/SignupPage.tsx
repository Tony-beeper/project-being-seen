import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import MuiLink from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SignupIcon from "@mui/icons-material/AccountBox";

import Layout from "components/Layout";
import DonorSignup from "components/Signup/Donor";
import YouthSignup from "components/Signup/Youth";
import MerchantSignup from "components/Signup/Merchant";
import { decodeAuthToken } from "utils/authHelpers";

import styles from "./SignupPage.module.scss";

// Render the signup page and handle navigation between the various signup
// forms for different user types. If a user is already logged in, they are
// redirected to the homepage.
const SignupPage = () => {
  const history = useHistory();
  const account = decodeAuthToken();
  const [tab, setTab] = useState(0);

  if (account) {
    history.push("/");
  }

  const changeTab = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Layout title="Signup">
      <Container maxWidth="xs">
        <div className={styles.signupContainer}>
          <Avatar sx={{ mb: 2, bgcolor: "primary.main" }}>
            <SignupIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={2}>
            Signup as...
          </Typography>
          <Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={changeTab}
              className={styles.tabOverrides}
              variant="fullWidth"
            >
              <Tab label="Youth" />
              <Tab label="Donor" />
              <Tab label="Merchant" />
            </Tabs>
          </Box>
          <Box sx={{ width: 1 }}>
            {tab === 0 && <YouthSignup />}
            {tab === 1 && <DonorSignup />}
            {tab === 2 && <MerchantSignup />}
          </Box>
          <Typography align="center" variant="body2">
            Already have an account?
            <MuiLink to="/login" component={Link} sx={{ ml: 1 }}>
              Login
            </MuiLink>
          </Typography>
        </div>
      </Container>
    </Layout>
  );
};

export default SignupPage;
