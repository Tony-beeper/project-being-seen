import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import UpArrowIcon from "@mui/icons-material/ArrowUpward";
import DownArrowIcon from "@mui/icons-material/ArrowDownward";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Product } from "common/Types";
import Layout from "components/Layout";
import ProductCard from "components/Card/Product";

import productCategories from "utils/productCategories";
import handleResponseError from "utils/handleResponseError";
import { decodeAuthToken } from "utils/authHelpers";
import UserRoles from "utils/UserRoles";
import axiosBase from "utils/axiosBase";

// Render the store page of the application. If a user is not logged in (or does
// not have the youth role), we redirect them to the homepage.
const StorePage = () => {
  const history = useHistory();
  const account = decodeAuthToken();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [renderedProducts, setRenderedProducts] = useState<Product[]>([]);

  if (!account || account.role !== UserRoles.youth) {
    history.push("/");
  }

  useEffect(() => {
    axiosBase
      .get("/user/merchant/products")
      .then((response) => {
        setProducts(response.data);
        setRenderedProducts(response.data);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account?.username]);

  useEffect(() => {
    setRenderedProducts(
      products
        .filter((product) => {
          return product.name.toLowerCase().includes(search.toLowerCase());
        })
        .filter((product) => {
          return category === "All" || product.category === category;
        })
    );
  }, [products, search, category]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const sortProductsAscending = () =>
    [...products].sort((p1, p2) => p1.price - p2.price);

  const handleSortAscending = () => {
    setProducts(sortProductsAscending());
  };

  const handleSortDescending = () => {
    setProducts(sortProductsAscending().reverse());
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  return (
    <Layout title="Store" loading={loading}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box mb={3}>
          <Typography variant="h4">Store</Typography>
          <Box display="flex" alignItems="flex-end" mt={3}>
            <SearchIcon sx={{ mr: 1, my: 0.5 }} />
            <TextField
              label="Search"
              variant="standard"
              value={search}
              onChange={handleSearchChange}
            />
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleSortAscending}
              endIcon={<UpArrowIcon />}
            >
              Sort Price
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleSortDescending}
              endIcon={<DownArrowIcon />}
            >
              Sort Price
            </Button>
            <FormControl sx={{ ml: 2, width: 235 }}>
              <Select
                size="small"
                onChange={handleCategoryChange}
                value={category}
              >
                {["All", ...productCategories].map((product) => (
                  <MenuItem key={`select-${product}`} value={product}>
                    Category: {product}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        {renderedProducts.length ? (
          <Grid container spacing={2}>
            {renderedProducts.map((product, idx) => (
              <Grid key={`p-${idx}`} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <ProductCard {...product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Sorry, no product is offered</Typography>
        )}
      </Container>
    </Layout>
  );
};

export default StorePage;
