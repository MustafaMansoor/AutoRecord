import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
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
import PurchaseTable from './PurchaseTable';

const Purchase = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { purchases } = useFetchPurchases(companyId);
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
                  color: "#84B048", 
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#84B048", 
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
      <PurchaseTable purchases={filteredPurchases} handleClickOpen={handleClickOpen} tabValue={tabValue} />
    </div>
  );
};

export default Purchase;
