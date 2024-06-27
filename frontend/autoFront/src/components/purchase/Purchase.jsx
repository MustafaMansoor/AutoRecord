import React, { useEffect, useState } from 'react';
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
  Checkbox,
} from '@mui/material';
import PurchasesHeader from './PurchaseHeader';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const companyId = '667d4c5b2ed036e6bbe8e967';
    // Replace with your backend endpoint
    axios.get(`http://localhost:3000/api/companies/${companyId}/purchases`)
      .then(response => {
        if (response.data && Array.isArray(response.data.purchases)) {
          setPurchases(response.data.purchases);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the purchases!', error);
      });
  }, []);

  return (
    <div>
      {/* <PurchasesHeader /> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> <b>View</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Supplier Name</b></TableCell>
              <TableCell><b>Supplier Account</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>VAT Code</b></TableCell>
              <TableCell><b>Cur</b></TableCell>
              <TableCell><b>Net</b></TableCell>
              <TableCell><b>VAT</b></TableCell>
              <TableCell><b>Total</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              purchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell><Button variant="contained">View</Button></TableCell>
                  <TableCell>{purchase.date || ''}</TableCell>
                  <TableCell>{purchase.supplierName || ''}</TableCell>
                  <TableCell>{purchase.supplierAccount || ''}</TableCell>
                  <TableCell>{purchase.category || ''}</TableCell>
                  <TableCell>{purchase.vatCode || ''}</TableCell>
                  <TableCell>{purchase.currency || ''}</TableCell>
                  <TableCell>{purchase.net || ''}</TableCell>
                  <TableCell>{purchase.vat || ''}</TableCell>
                  <TableCell>{purchase.total || ''}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Purchases;
