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

const YouthProfile = () => {
  const account = decodeAuthToken();
  const [loading, setLoading] = useState(true);

  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [story, setStory] = useState("");
  const [savingPlan, setSavingPlan] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    axiosBase
      .get("/user/youth", {
        params: {
          username: account?.username,
        },
      })
      .then((response) => {
        setOldName(response.data.name);
        setNewName(response.data.name);
        setPictureUrl(response.data.profile_picture);
        setSavingPlan(response.data.saving_plan);
        setStory(response.data.story);
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
    setNewName(event.target.value);
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPictureUrl(event.target.value);
  };

  const handleStoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStory(event.target.value);
  };

  const handleSavingPlanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSavingPlan(event.target.value);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axiosBase
      .patch(
        "/user/youth/update",
        {
          name: newName,
          story: story,
          saving_plan: savingPlan,
          profile_picture: pictureUrl,
        },
        getAuthHeader()
      )
      .then((response) => {
        toast.success(response.data.message);
        setOldName(newName);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      });
  };

  return (
    <Layout title="Youth Profile" loading={loading}>
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
              fullWidth
              required
              label="Name"
              margin="normal"
              onChange={handleNameChange}
              value={newName}
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
              label="Story"
              onChange={handleStoryChange}
              value={story}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Saving Plan"
              onChange={handleSavingPlanChange}
              value={savingPlan}
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

export default YouthProfile;
