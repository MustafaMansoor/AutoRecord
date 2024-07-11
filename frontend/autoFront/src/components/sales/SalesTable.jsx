import React from 'react';
import { useNavigate,useParams } from 'react-router-dom';
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
import './Sale.css';

const SaleTable = ({ sales , tabValue }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const handleClickOpen = (sale) => {
    navigate(`/sales/${companyId}/view`, { state: { sale } });
  };

  return (
    <TableContainer
      component={Paper}
      className="sale-table-container"
      sx={{ border: "1px solid #ccc", marginTop: "20px" , width: "98%",display: "block", marginLeft: "auto", marginRight: "auto"}}
    >
      <Table sx={{ minWidth: 650 }} aria-label="sales table">
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
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Customer Name</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Customer Account</b></TableCell>
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
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tabValue === "rejected" ? 4 : 10} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleClickOpen(sale)}
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
                <TableCell>{new Date(sale.date).toLocaleDateString() || ""}</TableCell>
                {tabValue === "rejected" && (
                  <>
                    <TableCell>{sale.invoiceNumber || ""}</TableCell>
                    <TableCell>{sale.reason || ""}</TableCell>
                  </>
                )}
                {tabValue !== "rejected" && (
                  <>
                    <TableCell>{sale.customerName || ""}</TableCell>
                    <TableCell>{sale.customerAccount || ""}</TableCell>
                    <TableCell>{sale.category || ""}</TableCell>
                    <TableCell>{sale.vatCode || ""}</TableCell>
                    <TableCell>{sale.currency || ""}</TableCell>
                    <TableCell>{sale.net || ""}</TableCell>
                    <TableCell>{sale.vat || ""}</TableCell>
                    <TableCell>{sale.total || ""}</TableCell>
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

export default SaleTable;