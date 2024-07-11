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
import './Supplier.css';

const SupplierTable = ({ suppliers , tabValue }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const handleClickOpen = (supplier) => {
    console.log(supplier)
    navigate(`/suppliers/${companyId}/view`, { state: { supplier } });
  };

  return (
    <TableContainer
      component={Paper}
      className="supplier-table-container"
      sx={{ border: "1px solid #ccc", marginTop: "20px" , width: "98%",display: "block", marginLeft: "auto", marginRight: "auto"}}
    >
      <Table sx={{ minWidth: 650 }} aria-label="supplier table">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>View</b></TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Date</b></TableCell>
            {tabValue === "rejected" && (
              <>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Statement Number</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Reason</b></TableCell>
              </>
            )}
            {tabValue !== "rejected" && (
              <>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Supplier Name</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Supplier Account</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Date Range</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>Currency</b></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}><b>statementNumber</b></TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tabValue === "rejected" ? 4 : 10} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleClickOpen(supplier)}
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
                <TableCell>{new Date(supplier.date).toLocaleDateString() || ""}</TableCell>
                {tabValue === "rejected" && (
                  <>
                  
                  <TableCell>{supplier.statementNumber || ""}</TableCell>
                    <TableCell>{supplier.reason || ""}</TableCell>
                  </>
                )}
                {tabValue !== "rejected" && (
                  <>
                    <TableCell>{supplier.supplierName || ""}</TableCell>
                    <TableCell>{supplier.supplierAccount || ""}</TableCell>
                    <TableCell>{supplier.dateRange || ""}</TableCell>
                    <TableCell>{supplier.currency || ""}</TableCell>
                    <TableCell>{supplier.statementNumber || ""}</TableCell>
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

export default SupplierTable;