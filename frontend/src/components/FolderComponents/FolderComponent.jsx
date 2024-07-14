import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import RejectedIcon from "@mui/icons-material/Cancel";
import "./FolderComponent.css";
import useFetchPurchases from './customHooks/useFetchData';
import FolderTable from './FolderTable';
import NavigationTabs from './NavigationTabs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const FolderComponent = ({value}) => {
  const { companyId } = useParams();
  const { data } = useFetchPurchases(companyId, value);
  const [tabValue, setTabValue] = useState("pending");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredData = data.filter(
    (val) => val.status === tabValue
  );



  return (
    <div>
      <div className="top-header">
        <Box className="purchase-header">
          <NavigationTabs  ele = {[value,"purchases","sales","suppliers"]}companyId={companyId} />
          <Box className="purchase-tabs">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor=""
              indicatorColor="secondary"
              sx={{
                "& .MuiTab-root": {
                  
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
                icon={<AccessTimeIcon />}
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
      <FolderTable data={filteredData} tabValue={tabValue}  type={value} />
    </div>
  );
};

export default FolderComponent;