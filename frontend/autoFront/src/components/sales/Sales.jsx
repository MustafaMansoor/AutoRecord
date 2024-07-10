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

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [tabValue, setTabValue] = useState('pending');
  const { companyId } = useParams(); 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/sales`)
      .then(response => {
        if (response.data && Array.isArray(response.data.sales)) {
          setSales(response.data.sales);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the sales!', error);
      });
  }, [companyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSales = sales.filter(sale => sale.status === tabValue);

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
              <TableCell><b>Invoice Number</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Customer Name</b></TableCell>
              <TableCell><b>Customer Account</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>VAT Code</b></TableCell>
              <TableCell><b>Currency</b></TableCell>
              <TableCell><b>Net</b></TableCell>
              <TableCell><b>VAT</b></TableCell>
              <TableCell><b>Total</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell><Button variant="contained">View</Button></TableCell>
                  <TableCell>{sale.invoiceNumber || ''}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString() || ''}</TableCell>
                  <TableCell>{sale.customerName || ''}</TableCell>
                  <TableCell>{sale.customerAccount || ''}</TableCell>
                  <TableCell>{sale.category || ''}</TableCell>
                  <TableCell>{sale.vatCode || ''}</TableCell>
                  <TableCell>{sale.currency || ''}</TableCell>
                  <TableCell>{sale.net || ''}</TableCell>
                  <TableCell>{sale.vat || ''}</TableCell>
                  <TableCell>{sale.total || ''}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sales;
