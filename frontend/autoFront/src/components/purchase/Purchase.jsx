import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [tabValue, setTabValue] = useState('pending'); // Default to "Processing"
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/purchases`)
      .then(response => {
        if (response.data && Array.isArray(response.data.purchases)) {
          setPurchases(response.data.purchases);
          console.log(response.data.purchases)
        } else {
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the purchases!', error);
      });
  }, [companyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredPurchases = purchases.filter(purchase => purchase.status === tabValue);

  const handleClickOpen = (purchase) => {
    navigate(`/purchases/${companyId}/view`, { state: { purchase } });
  };

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
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>VAT Code</b></TableCell>
              <TableCell><b>Currency</b></TableCell>
              <TableCell><b>Net</b></TableCell>
              <TableCell><b>VAT</b></TableCell>
              <TableCell><b>Total</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleClickOpen(purchase)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(purchase.date).toLocaleDateString() || ''}</TableCell>
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

export default Purchase;
