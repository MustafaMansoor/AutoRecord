import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchSales from './customHooks/useFetchSales';
import SaleTable from './SalesTable';
import { Box, Tab, Tabs } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import RejectedIcon from '@mui/icons-material/Cancel';
import NavigationTabs from '../purchase/NavigationTabs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Sales = () => {
  const [tabValue, setTabValue] = useState('pending');
  const { companyId } = useParams(); 
const { sales } = useFetchSales(companyId);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSales = sales.filter(sale => sale.status === tabValue);

  return (
    <div>
    <div className="top-header">
      <Box className="sale-header">
        <NavigationTabs  ele = {["sales","purchases","suppliers"]}companyId={companyId} />
        <Box className="sale-tabs">
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
    <SaleTable sales={filteredSales} tabValue={tabValue} />
  </div>
  );
};

export default Sales;
