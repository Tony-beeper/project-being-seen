import React, { useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { dollarToCredit } from "utils/creditDollarConvertion";
import { Order } from "common/Types";
import { Card, CardContent, Grid, Typography } from "@mui/material";

interface StatisticProps {
  stat: string | number;
  label: string;
}

// Renders a statistic followed by a label (used for Order card)
const Statistic = ({ stat, label }: StatisticProps) => (
  <div style={{ textAlign: "center" }}>
    <Typography sx={{ fontWeight: 700 }} variant="h6">
      {stat}
    </Typography>
    <Typography color="text.secondary">{label}</Typography>
  </div>
);

interface OrdersTableProps {
  inCredits?: boolean;
  orders: Order[];
  maxHeight?: number;
  isMerchant?: boolean;
}

// Renders a table showing a list of orders (youth, merchant, product, Cost, date)
const OrderCard = ({
  inCredits,
  orders,
  maxHeight,
  isMerchant,
}: OrdersTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  let previousOrderTotal = 0;
  orders.forEach((order) => (previousOrderTotal += order.price));

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Card style={{ background: "rgba(0 0 0 / 2%)" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Statistic
              stat={
                inCredits
                  ? `${dollarToCredit(previousOrderTotal)} CR`
                  : `$${previousOrderTotal}`
              }
              label={inCredits ? "spent" : "total"}
            />
          </Grid>
          <Grid item xs={6}>
            <Statistic stat={orders.length} label="orders" />
          </Grid>
        </Grid>
        {orders.length !== 0 && (
          <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
            <TableContainer sx={{ maxHeight: maxHeight || 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {isMerchant ? (
                      <TableCell sx={{ fontWeight: 700 }}>Youth</TableCell>
                    ) : (
                      <TableCell sx={{ fontWeight: 700 }}>Merchant</TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .reverse()
                    .map((row, idx) => (
                      <TableRow hover tabIndex={-1} key={`${row.youth}-${idx}`}>
                        {isMerchant ? (
                          <TableCell>{row.youth}</TableCell>
                        ) : (
                          <TableCell>{row.merchant}</TableCell>
                        )}
                        <TableCell>{row.product}</TableCell>
                        <TableCell>
                          {inCredits
                            ? `${dollarToCredit(row.price)} CR`
                            : `$${row.price}`}
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={orders.length}
              rowsPerPageOptions={[5, 10, 25]}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
