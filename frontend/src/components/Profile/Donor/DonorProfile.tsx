import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Layout from "components/Layout";
import handleResponseError from "utils/handleResponseError";
import { decodeAuthToken, getAuthHeader } from "utils/authHelpers";
import axiosBase from "utils/axiosBase";

const DonorProfile = () => {
  const account = decodeAuthToken();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [anonymize, setAnonymize] = useState(false);
  const [oldName, setOldName] = useState("");
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    axiosBase
      .post("/user/donor/private", {}, getAuthHeader())
      .then((response) => {
        setName(response.data.name);
        setOldName(response.data.name);
        setPictureUrl(response.data.profile_picture);
        setOrganization(response.data.organization);
        setAnonymize(response.data.anonymize);
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

  const handleOrganizationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrganization(event.target.value);
  };

  const handleAnonymizeChange = (event: any, checked: boolean) => {
    setAnonymize(checked);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axiosBase
      .patch(
        "/user/donor/update",
        {
          name: name,
          anonymize: anonymize,
          profile_picture: pictureUrl,
          organization: organization,
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
    <Layout title="Donor Profile" loading={loading}>
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
              multiline
              rows={4}
              margin="normal"
              label="Organization"
              onChange={handleOrganizationChange}
              value={organization}
            />
            <FormControlLabel
              checked={anonymize}
              label="Anonymize My Name"
              onChange={handleAnonymizeChange}
              control={<Checkbox />}
              //value={anonymize}
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

export default DonorProfile;
