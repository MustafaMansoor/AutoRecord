import React from 'react';
import useNavigationHandlers from './customHooks/useNavigationHandlers';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";

function NavigationTabs({ ele,companyId}) {
  const navigate = useNavigate();
  const { handleMenuClick, handleMenuClose, anchorEl } = useNavigationHandlers();


  return (
    <div>
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
              {ele[0]}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose()}
              className="menuContainer"
            >
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/${ele[0]}/${companyId}`)}
              >
                {ele[0]}
              </MenuItem>
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/${ele[1]}/${companyId}`)}
              >
                {ele[1]}
              </MenuItem>
              <MenuItem
                className="menuItem"
                onClick={() => handleMenuClose(`/${ele[2]}/${companyId}`)}
              >
                {ele[2]}
              </MenuItem>
            </Menu>
          </Box>
    </div>
  );
}

export default NavigationTabs;