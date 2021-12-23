import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axiosBase from "utils/axiosBase";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { Product, Order } from "common/Types";
import ProductCard from "components/Card/Product";
import OrderCard from "components/Card/Orders";
import { decodeAuthToken } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import Layout from "components/Layout";
import { getAuthHeader } from "utils/authHelpers";

const MerchantDashboard = () => {
  const account = decodeAuthToken();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const history = useHistory();

  useEffect(() => {
    axiosBase
      .post("/user/merchant/private", {}, getAuthHeader())
      .then((response) => {
        setProducts(response.data.products);
        setOrders(response.data.orders);
      })
      .catch(({ response }) => {
        handleResponseError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account?.username]);

  const handleDelete = (name: string) => {
    axiosBase
      .post(
        "/user/merchant/products/delete",
        {
          name: name,
        },
        getAuthHeader()
      )
      .then((response) => {
        toast.success(response.data.message);
        setProducts(
          products.filter((product) => {
            return product.name !== name;
          })
        );
      })
      .catch(({ response }) => handleResponseError(response));
  };

  const handleEdit = (name: string) => {
    history.push({ pathname: "/edit", state: name });
  };

  return (
    <Layout title="Merchant Dashboard" loading={loading}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">My products</Typography>
          <Button to="/upload" component={Link} variant="contained">
            Upload new product
          </Button>
        </Box>
        {products.length ? (
          <Grid container spacing={2}>
            {products.map((product, idx) => (
              <Grid key={`p-${idx}`} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <ProductCard
                  {...product}
                  isMerchant
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No products uploaded yet</Typography>
        )}
        <Typography variant="h4" mt={7} mb={3}>
          Past Orders
        </Typography>
        <OrderCard orders={orders} isMerchant />
      </Container>
    </Layout>
  );
};

export default MerchantDashboard;
