import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CategoryDropdown from "./CategoryDropDown";
import axios from "axios";

const FolderTable = ({ data, tabValue, type }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState(
    data.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.category || "" }),
      {}
    )
  );

  const handleClickOpen = (item) => {
    navigate(`/${type}/${companyId}/view`, { state: { item } });
  };

  const handleCategoryChange = (itemId, category) => {
    setSelectedCategories((prevCategories) => ({
      ...prevCategories,
      [itemId]: category,
    }));
  };

  const renderHeaderCells = () => {
    const commonHeaders = [{ label: "View" }, { label: "Date" }];

    const rejectedHeaders = [
      { label: "Invoice Number", field: "invoiceNumber" },
      { label: "Reason", field: "reason" },
    ];

    const nonRejectedHeaders = {
      purchases: [
        { label: "Supplier Name", field: "supplierName" },
        { label: "Supplier Account", field: "supplierAccount" },
        { label: "Category", field: "category" },
        { label: "VAT Code", field: "vatCode" },
        { label: "Currency", field: "currency" },
        { label: "Net", field: "net" },
        { label: "VAT", field: "vat" },
        { label: "Total", field: "total" },
      ],
      sales: [
        { label: "Customer Name", field: "customerName" },
        { label: "Customer Account", field: "customerAccount" },
        { label: "Category", field: "category" },
        { label: "VAT Code", field: "vatCode" },
        { label: "Currency", field: "currency" },
        { label: "Net", field: "net" },
        { label: "VAT", field: "vat" },
        { label: "Total", field: "total" },
      ],
      suppliers: [
        { label: "Supplier Name", field: "supplierName" },
        { label: "Supplier Account", field: "supplierAccount" },
        { label: "Date Range", field: "dateRange" },
        { label: "Currency", field: "currency" },
        { label: "Statement Number", field: "statementNumber" },
      ],
    };

    return tabValue === "rejected"
      ? commonHeaders.concat(rejectedHeaders)
      : commonHeaders.concat(nonRejectedHeaders[type]);
  };

  const renderBodyCells = (item) => {
    return tabValue === 'rejected'
      ? (
        <>
          <TableCell>{item.invoiceNumber || ''}</TableCell>
          <TableCell>{item.reason || ''}</TableCell>
        </>
      )
      : (
        <>
          {type === 'purchases' && (
            <>
              <TableCell>{item.supplierName || ''}</TableCell>
              <TableCell>{item.supplierAccount || ''}</TableCell>
              <TableCell>
                <CategoryDropdown
                  type={type}
                  selectedCategory={item.category || ''}
                  onCategoryChange={(category) => handleCategoryChange(item._id, category)}
                  companyId={companyId}
                  itemId={item._id}
                />
              </TableCell>
              <TableCell>{item.vatCode || ''}</TableCell>
              <TableCell>{item.currency || ''}</TableCell>
              <TableCell>{item.net || ''}</TableCell>
              <TableCell>{item.vat || ''}</TableCell>
              <TableCell>{item.total || ''}</TableCell>
            </>
          )}
          {type === 'sales' && (
            <>
              <TableCell>{item.customerName || ''}</TableCell>
              <TableCell>{item.customerAccount || ''}</TableCell>
              <TableCell>
                <CategoryDropdown
                  type={type}
                  selectedCategory={item.category || ''}
                  onCategoryChange={(category) => handleCategoryChange(item._id, category)}
                  companyId={companyId}
                  itemId={item._id}
                />
              </TableCell>
              <TableCell>{item.vatCode || ''}</TableCell>
              <TableCell>{item.currency || ''}</TableCell>
              <TableCell>{item.net || ''}</TableCell>
              <TableCell>{item.vat || ''}</TableCell>
              <TableCell>{item.total || ''}</TableCell>
            </>
          )}
          {type === 'suppliers' && (
            <>
              <TableCell>{item.supplierName || ''}</TableCell>
              <TableCell>{item.supplierAccount || ''}</TableCell>
              <TableCell>{item.dateRange || ''}</TableCell>
              <TableCell>{item.currency || ''}</TableCell>
              <TableCell>{item.statementNumber || ''}</TableCell>
            </>
          )}
        </>
      );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid #ccc",
        marginTop: "20px",
        width: "98%",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        maxHeight: 450,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label={`${type} table`} stickyHeader>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            {renderHeaderCells().map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold", color: "#333" }}>
                <b>{header.label}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  tabValue === "rejected" ? 4 : renderHeaderCells().length
                }
                align="center"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleClickOpen(item)}
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
                <TableCell>
                  {new Date(item.date).toLocaleDateString() || ""}
                </TableCell>
                {renderBodyCells(item)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FolderTable;
