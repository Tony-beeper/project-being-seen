import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import { PrivateYouth } from "common/Types";
import { decodeAuthToken, getAuthHeader } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import DonationCard from "components/Card/Donation";
import OrderCard from "components/Card/Orders/OrderCard";
import axiosBase from "utils/axiosBase";
import Layout from "components/Layout";
import ShareButtons from "components/ShareButtons";

const YouthDashboard = () => {
  const account = decodeAuthToken();
  const [loading, setLoading] = useState(true);
  const [youth, setYouth] = useState<PrivateYouth | null>(null);

  useEffect(() => {
    axiosBase
      .post("/user/youth/private", {}, getAuthHeader())
      .then((response) => {
        setYouth({
          name: response.data.name,
          username: response.data.username,
          dateOfBirth: response.data.date_of_birth,
          profilePicture: response.data.profile_picture,
          savingPlan: response.data.saving_plan,
          story: response.data.story,
          donations: response.data.donations,
          followCount: response.data.follow_count,
          creditBalance: response.data.credit_balance,
          orders: response.data.orders,
        });
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account?.username]);

  const shareUrl = encodeURI(
    document.location.host + "/u/" + account?.username
  );

  return (
    <Layout title="Youth Dashboard" loading={loading}>
      <ShareButtons shareUrl={shareUrl} />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        {youth ? (
          <>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography variant="h4">Welcome {youth.name}!</Typography>
              <Chip
                icon={<MoneyIcon />}
                label={`Balance: ${youth.creditBalance} CR`}
                color="primary"
                style={{
                  height: "2.5rem",
                  fontSize: "1.25rem",
                  borderRadius: "999px",
                }}
              />
            </Box>

            <DonationCard
              inCredits
              donations={youth.donations}
              followCount={youth.followCount}
            />

            <Typography variant="h4" mt={5} mb={3}>
              Past Orders
            </Typography>
            <OrderCard inCredits orders={youth.orders} />
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

export default YouthDashboard;
