import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import Layout from "components/Layout";
import handleResponseError from "utils/handleResponseError";
import { decodeAuthToken, getAuthHeader } from "utils/authHelpers";
import axiosBase from "utils/axiosBase";

const MerchantProfile = () => {
  const account = decodeAuthToken();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [email, setEmail] = useState("");
  const [oldName, setOldName] = useState("");
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    axiosBase
      .post("/user/merchant/private", {}, getAuthHeader())
      .then((response) => {
        setName(response.data.name);
        setOldName(response.data.name);
        setPictureUrl(response.data.profile_picture);
        setStoreLocation(response.data.store_location);
        setStoreName(response.data.store_name);
        setEmail(response.data.email);
        setUserExists(true);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account?.username]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPictureUrl(event.target.value);
  };

  const handleStoreNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStoreName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoreLocation(event.target.value);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axiosBase
      .patch(
        "/user/merchant/update",
        {
          name: name,
          store_name: storeName,
          store_location: storeLocation,
          profile_picture: pictureUrl,
          email: email,
        },
        getAuthHeader()
      )
      .then((response) => {
        toast.success(response.data.message);
        setOldName(name);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      });
  };

  return (
    <Layout title="Merchant Profile" loading={loading}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {userExists ? (
          <Box
            noValidate
            component="form"
            onSubmit={handleUpdate}
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={1}
          >
            <Avatar src={pictureUrl} sx={{ width: 96, height: 96 }} />
            <Typography variant="h4" my={4}>
              Hello {oldName}
            </Typography>
            <TextField
              autoFocus
              required
              fullWidth
              label="Name"
              margin="normal"
              onChange={handleNameChange}
              value={name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Profile Picture URL"
              onChange={handlePictureChange}
              value={pictureUrl}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Store Name"
              onChange={handleStoreNameChange}
              value={storeName}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Store Location"
              onChange={handleLocationChange}
              value={storeLocation}
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Profile
            </Button>
          </Box>
        ) : (
          <Typography variant="h3">Cannot find {account?.username}</Typography>
        )}
      </Container>
    </Layout>
  );
};

export default MerchantProfile;
