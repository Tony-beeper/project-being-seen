import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Layout from "components/Layout";
import YouthCard from "components/Card/Youth";

import axiosBase from "utils/axiosBase";
import handleResponseError from "utils/handleResponseError";
import { PublicYouth } from "common/Types";

// Render the homepage of the application
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [youths, setYouths] = useState<PublicYouth[]>([]);
  const [search, setSearch] = useState("");
  const [renderedYouths, setRenderedYouths] = useState<PublicYouth[]>([]);

  useEffect(() => {
    axiosBase
      .get("/user/youth")
      .then((response) => {
        const retrievedYouths = response.data.map((data: any) => ({
          name: data.name,
          username: data.username,
          dateOfBirth: data.date_of_birth,
          profilePicture: data.profile_picture,
          savingPlan: data.saving_plan,
          story: data.story,
          donations: data.donations,
        }));

        setYouths(retrievedYouths);
        setRenderedYouths(retrievedYouths);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setRenderedYouths(
      youths.filter((youth) => {
        return (
          youth.username.toLowerCase().includes(search.toLowerCase()) ||
          youth.name.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [youths, search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Layout title="Home" loading={loading}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Typography variant="h4" align="center" sx={{ mb: 5 }}>
          At-Risk Youths
        </Typography>
        <Box display="flex" alignItems="flex-end" mt={3} mb={3}>
          <SearchIcon sx={{ mr: 1, my: 0.5 }} />
          <TextField
            label="Search"
            variant="standard"
            value={search}
            onChange={handleSearchChange}
          />
        </Box>
        {renderedYouths.length ? (
          <Grid container spacing={2}>
            {renderedYouths.map((youth, idx) => (
              <Grid
                key={`youth-${idx}`}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
              >
                <YouthCard {...youth} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Sorry, no youths found under this name</Typography>
        )}
      </Container>
    </Layout>
  );
};

export default HomePage;
