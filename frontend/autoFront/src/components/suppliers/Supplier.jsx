import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [tabValue, setTabValue] = useState('pending'); // Default to "Processing"
  const { companyId } = useParams(); 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/suppliers`)
      .then(response => {
        if (response.data && Array.isArray(response.data.suppliers)) {
          setSuppliers(response.data.suppliers);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the suppliers!', error);
      });
  }, [companyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSuppliers = suppliers.filter(supplier => supplier.status === tabValue);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Inbox" value="inbox" />
          <Tab label="Processing" value="pending" />
          <Tab label="Rejected" value="rejected" />
        </Tabs>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>View</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Supplier Name</b></TableCell>
              <TableCell><b>Supplier Account</b></TableCell>
              <TableCell><b>Currency</b></TableCell>
              <TableCell><b>Date Range</b></TableCell>
              <TableCell><b>Statement Number</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier, index) => (
                <TableRow key={index}>
                  <TableCell><Button variant="contained">View</Button></TableCell>
                  <TableCell>{new Date(supplier.date).toLocaleDateString() || ''}</TableCell>
                  <TableCell>{supplier.supplierName || ''}</TableCell>
                  <TableCell>{supplier.supplierAccount || ''}</TableCell>
                  <TableCell>{supplier.currency || ''}</TableCell>
                  <TableCell>{supplier.dateRange || ''}</TableCell>
                  <TableCell>{supplier.statementNumber || ''}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Supplier;
