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
import { Donation } from "common/Types";

interface DonationsTableProps {
  inCredits?: boolean;
  donations: Donation[];
  maxHeight?: number;
  isDonor?: boolean;
}

// Renders a table showing a list of donations (donor, youth, amount, time)
const DonationsTable = ({
  inCredits,
  donations,
  maxHeight,
  isDonor,
}: DonationsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: maxHeight || 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {isDonor ? (
                <TableCell sx={{ fontWeight: 700 }}>Youth</TableCell>
              ) : (
                <TableCell sx={{ fontWeight: 700 }}>Donor</TableCell>
              )}
              <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow hover tabIndex={-1} key={`${row.donor}-${idx}`}>
                  {isDonor ? (
                    <TableCell>{row.youth}</TableCell>
                  ) : (
                    <TableCell>{row.donor}</TableCell>
                  )}
                  <TableCell>
                    {inCredits
                      ? `${dollarToCredit(row.amount)} CR`
                      : `$${row.amount}`}
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={donations.length}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DonationsTable;
