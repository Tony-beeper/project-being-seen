import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import Layout from "components/Layout";
import { getAuthHeader } from "utils/authHelpers";
import { decodeAuthToken } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import UserRoles from "utils/UserRoles";
import axiosBase from "utils/axiosBase";
import productCategories from "../../utils/productCategories";

// Render the dashboard page of the application. If a user is not logged in (or
// is not a merchant), we redirect them to the homepage.
const EditPage = () => {
  const history = useHistory();
  const account = decodeAuthToken();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  if (!account || account.role !== UserRoles.merchant) {
    history.push("/");
  }

  useEffect(() => {
    axiosBase
      .get("/user/merchant/products", {
        params: {
          name: history.location.state,
        },
      })
      .then((response) => {
        setName(response.data.name);
        setPictureUrl(response.data.picture);
        setPrice(String(response.data.price));
        setDescription(response.data.description);
        setCategory(response.data.category);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [history.location.state]);

  // Sends a post request to backend API to update product details
  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axiosBase
      .patch(
        "/user/merchant/products/update",
        {
          new_name: name,
          old_name: history.location.state,
          description: description,
          picture: pictureUrl,
          price: price,
          category: category,
        },
        getAuthHeader()
      )
      .then((response) => {
        // On success, we redirect to dashboard and show a success message
        history.push("/dashboard");
        toast.success(response.data.message);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictureUrl(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  return (
    <Layout title="Edit Page" loading={loading}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography gutterBottom align="center" variant="h4">
          Edit product details
        </Typography>
        <Box
          noValidate
          component="form"
          onSubmit={handleEdit}
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={1}
        >
          <TextField
            autoFocus
            required
            fullWidth
            value={name}
            onChange={handleNameChange}
            label="Product Name"
            margin="normal"
          />
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
            label="Description"
            margin="normal"
          />
          <TextField
            required
            fullWidth
            select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
            margin="normal"
          >
            {productCategories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            fullWidth
            value={price}
            onChange={handlePriceChange}
            label="Price"
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            value={pictureUrl}
            onChange={handlePictureChange}
            label="Product Picture URL"
            margin="normal"
          />
          {pictureUrl && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Avatar
                src={pictureUrl}
                sx={{ width: 128, height: 128 }}
                alt={name}
              />
            </Box>
          )}
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update product
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default EditPage;
