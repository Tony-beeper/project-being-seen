import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuthHeader, removeAuthToken } from "utils/authHelpers";
import axiosBase from "utils/axiosBase";

interface AuthLayerProps {
  children: React.ReactNode;
}

// Render a loading overlay
const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

// Render children after validating the current JWT token in local storage
const AuthLayer = ({ children }: AuthLayerProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/user/validate", getAuthHeader())
      .catch(() => {
        // Catch indicates call failed (i.e., token is invalid). Thus, token is
        // to be removed from local storage due to its invalidity.
        removeAuthToken();
      })
      .finally(() => {
        // Regardless of whether call failed or succeeded, we end the loading
        // phase and render the children (who decide what to do).
        setTimeout(() => {
          setLoading(false);
        }, 750);
      });
  }, []);

  return loading ? <Loading /> : <>{children}</>;
};

export default AuthLayer;
