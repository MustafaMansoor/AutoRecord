import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import RejectedIcon from "@mui/icons-material/Cancel";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 16418647a543fe68fe9f7b14e2246a03a18b6f26
>>>>>>> Stashed changes
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
>>>>>>> 16418647a543fe68fe9f7b14e2246a03a18b6f26
import "./Purchase.css";
import useFetchPurchases from './customHooks/useFetchPurchases';
import PurchaseTable from './PurchaseTable';
import NavigationTabs from "./NavigationTabs";

const Purchase = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { purchases } = useFetchPurchases(companyId);
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
<<<<<<< HEAD
          <NavigationTabs  ele = {["purchases","sales","suppliers"]} companyId={companyId}/>
=======
          <Box className="purchase-header-left">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon className="MyBoldArrowBackIcon" />
            </IconButton>
            <Button
              onClick={handleMenuClick}
              className="purchase-menu-button"
              style={{ fontWeight: "bold", color: "#597C26" }}
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
          
>>>>>>> 16418647a543fe68fe9f7b14e2246a03a18b6f26
          <Box className="purchase-tabs">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                  paddingTop: 0,
                  paddingBottom: 0,
                  minHeight: "45px", 
                  height: "45px", // Set the fixed height
                },
                "& .Mui-selected": {
                  color: "#597C26", 
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#597C26", 
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
                icon={<ScheduleIcon />}
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
      <PurchaseTable className="table" purchases={filteredPurchases} handleClickOpen={handleClickOpen} tabValue={tabValue} />
    </div>
  );
};

export default Purchase;
