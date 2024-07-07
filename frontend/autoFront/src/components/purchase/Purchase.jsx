import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InboxIcon from "@mui/icons-material/Inbox";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import RejectedIcon from "@mui/icons-material/Cancel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Purchase.css";
import useFetchPurchases from './customHooks/useFetchPurchases';
import useNavigationHandlers from './customHooks/useNavigationHandlers';

const Purchase = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { purchases, loading, error } = useFetchPurchases(companyId);
  const { handleMenuClick, handleMenuClose, anchorEl } = useNavigationHandlers();
  const [tabValue, setTabValue] = useState("pending");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredPurchases = purchases.filter(
    (purchase) => purchase.status === tabValue
  );

  const handleClickOpen = (purchase) => {
    navigate(`/purchases/${companyId}/view`, { state: { purchase } });
  };


  return (
    <div>
      <div className="top-header">
        <Box className="purchase-header">
          <Box className="purchase-header-left">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon className="MyBoldArrowBackIcon" />
            </IconButton>
            <Button
              onClick={handleMenuClick}
              className="purchase-menu-button"
              sf={{ fontWeight: "bold", color: "#597C26" }}
              endIcon={<ArrowDropDownIcon />}
            >
              Purchases
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose()}
              className="menuContainer"
            >
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/purchases/${companyId}`)}
              >
                Purchases
              </MenuItem>
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/sales/${companyId}`)}
              >
                Sales
              </MenuItem>
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/suppliers/${companyId}`)}
              >
                Suppliers
              </MenuItem>
            </Menu>
          </Box>
          
          <Box className="purchase-tabs">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(0, 0, 0, 0.6)", // Default color for inactive tabs
                  paddingTop: 0,
                  paddingBottom: 0,
                  minHeight: "45px", // Set the minimum height
                  height: "45px", // Set the fixed height
                },
                "& .Mui-selected": {
                  color: "#84B048", // Color for the active tab
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#84B048", // Color for the tab indicator
                },
              }}
            >
              <Tab
                label="Inbox"
                value="inbox"
                icon={<InboxIcon />}
                iconPosition="start"
              />
              <Tab
                label="Processing"
                value="pending"
                icon={<PendingIcon />}
                iconPosition="start"
              />
              <Tab
                label="Rejected"
                value="rejected"
                icon={<RejectedIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

        </Box>
      </div>

      <TableContainer
        component={Paper}
        className="purchase-table-container"
        sx={{ border: "1px solid #ccc", marginTop: "20px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="purchases table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>View</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Date</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Supplier Name</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Supplier Account</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Category</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>VAT Code</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Currency</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Net</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>VAT</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                <b>Total</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Error fetching data
                </TableCell>
              </TableRow>
            ) : filteredPurchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases.map((purchase, index) => (
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
                  <TableCell>
                    {new Date(purchase.date).toLocaleDateString() || ""}
                  </TableCell>
                  <TableCell>{purchase.supplierName || ""}</TableCell>
                  <TableCell>{purchase.supplierAccount || ""}</TableCell>
                  <TableCell>{purchase.category || ""}</TableCell>
                  <TableCell>{purchase.vatCode || ""}</TableCell>
                  <TableCell>{purchase.currency || ""}</TableCell>
                  <TableCell>{purchase.net || ""}</TableCell>
                  <TableCell>{purchase.vat || ""}</TableCell>
                  <TableCell>{purchase.total || ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Purchase;
