import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import RejectedIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigationTabs from '../purchase/NavigationTabs';
import useFetchSuppliers from './customHooks/useFetchSuppliers';
import SupplierTable from './SuppliersTable';
const Supplier = () => {
  const { companyId } = useParams(); 
  const { suppliers } = useFetchSuppliers(companyId);
  const [tabValue, setTabValue] = useState('pending');


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSuppliers = suppliers.filter(supplier => supplier.status === tabValue);

  return (
    <div>
    <div className="top-header">
      <Box className="sale-header">
        <NavigationTabs  ele = {["suppliers","purchases","sales"]}companyId={companyId} />
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
      <SupplierTable suppliers={filteredSuppliers} tabValue={tabValue} />
    </div>
  );
};

export default Supplier;
