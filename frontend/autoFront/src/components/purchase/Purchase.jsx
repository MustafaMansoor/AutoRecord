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
    // Replace with your backend endpoint
    axios.get('http://localhost:3000/api/purchase')
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
      <PurchasesHeader />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>View</TableCell>
              <TableCell>Approve</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Supplier Account</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>VAT Code</TableCell>
              <TableCell>Cur</TableCell>
              <TableCell>Net</TableCell>
              <TableCell>VAT</TableCell>
              <TableCell>Total</TableCell>
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
                  <TableCell><Checkbox checked={purchase.status === 'approved'} /></TableCell>
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
