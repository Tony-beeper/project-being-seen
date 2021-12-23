import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Donor } from "common/Types";
import axiosBase from "utils/axiosBase";
import { decodeAuthToken, getAuthHeader } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import DonationCard from "components/Card/Donation";
import YouthCard from "components/Card/Youth";

import Layout from "components/Layout";
import { PublicYouth } from "common/Types";

const DonorDashboard = () => {
  const account = decodeAuthToken();
  const [loadingDonor, setLoadingDonor] = useState(true);
  const [loadingFollowingYouths, setLoadingFollowingYouths] = useState(true);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [followingYouths, setFollowingYouths] = useState<PublicYouth[]>([]);

  useEffect(() => {
    axiosBase
      .post("/user/donor/private", {}, getAuthHeader())
      .then((response) => {
        setDonor({
          name: response.data.name,
          username: response.data.username,
          organization: response.data.organization,
          profilePicture: response.data.profile_picture,
          dateOfBirth: response.data.date_of_birth,
          following: response.data.following,
          anonymize: response.data.anonymize,
          donations: response.data.donations,
        });
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoadingDonor(false);
      });
  }, [account?.username]);

  useEffect(() => {
    if (donor) {
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

          const followingYouths = retrievedYouths.filter((youth: any) => {
            return donor.following.includes(youth.username);
          });

          setFollowingYouths(followingYouths);
        })
        .catch(({ response }) => {
          handleResponseError(response);
        })
        .finally(() => {
          setLoadingFollowingYouths(false);
        });
    }
  }, [donor]);

  return (
    <Layout
      title="Donor Dashboard"
      loading={loadingDonor || loadingFollowingYouths}
    >
      <Container maxWidth="xl" sx={{ py: 5 }}>
        {donor ? (
          <>
            <Typography variant="h4" mb={4}>
              Welcome {donor.name}!
            </Typography>
            <DonationCard
              isDonating
              donations={donor.donations}
              isDonor
              followCount={donor.following.length}
            />
            <Typography variant="h4" mt={7} mb={3}>
              Youths Following
            </Typography>
            {followingYouths.length ? (
              <Grid container spacing={3}>
                {followingYouths.map((youth, idx) => (
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
              <Typography>You are not following any youths</Typography>
            )}
          </>
        ) : (
          <Typography variant="h4">
            Issue loading {account?.username}
          </Typography>
        )}
      </Container>
    </Layout>
  );
};

export default DonorDashboard;
