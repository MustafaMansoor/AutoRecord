import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import './Purchase.css';

const PurchaseTable = ({ purchases, handleClickOpen, tabValue }) => {
  console.log("PurchaseTable Component - tabValue:", tabValue);
  console.log("PurchaseTable Component - purchases:", purchases);

  return (
    <TableContainer
      component={Paper}
      className="purchase-table-container"
      sx={{ border: "1px solid #ccc", marginTop: "20px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="purchases table">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>View</b></TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Date</b></TableCell>
            {tabValue === "rejected" && (
              <>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Invoice Number</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Reason</b></TableCell>
              </>
            )}
            {tabValue !== "rejected" && (
              <>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Supplier Name</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Supplier Account</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Category</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>VAT Code</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Currency</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Net</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>VAT</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Total</b></TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tabValue === "rejected" ? 4 : 10} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleClickOpen(purchase)}
                    sx={{
                      backgroundColor: "#86B049",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#558B2F" },
                    }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>{new Date(purchase.date).toLocaleDateString() || ""}</TableCell>
                {tabValue === "rejected" && (
                  <>
                    <TableCell>{purchase.invoiceNumber || ""}</TableCell>
                    <TableCell>{purchase.reason || ""}</TableCell>
                  </>
                )}
                {tabValue !== "rejected" && (
                  <>
                    <TableCell>{purchase.supplierName || ""}</TableCell>
                    <TableCell>{purchase.supplierAccount || ""}</TableCell>
                    <TableCell>{purchase.category || ""}</TableCell>
                    <TableCell>{purchase.vatCode || ""}</TableCell>
                    <TableCell>{purchase.currency || ""}</TableCell>
                    <TableCell>{purchase.net || ""}</TableCell>
                    <TableCell>{purchase.vat || ""}</TableCell>
                    <TableCell>{purchase.total || ""}</TableCell>
                  </>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseTable;
