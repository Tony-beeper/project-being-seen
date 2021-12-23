import React, { useEffect } from "react";

import Header from "components/Header";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface DefaultTemplateProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

// Render header followed by the passed children (also sets document title)
const Layout = ({ title, children, loading }: DefaultTemplateProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Header />
      {loading ? (
        <Box display="flex" justifyContent="center" p={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Box p={{ xs: 2, sm: 3 }} component="main">
          {children}
        </Box>
      )}
    </>
  );
};

export default Layout;
