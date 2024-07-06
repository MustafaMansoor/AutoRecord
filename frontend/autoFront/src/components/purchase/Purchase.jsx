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
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InboxIcon from '@mui/icons-material/Inbox';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import RejectedIcon from '@mui/icons-material/Cancel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './Purchase.css';


const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [tabValue, setTabValue] = useState('pending'); // Default to "Processing"
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (path) => {
    setAnchorEl(null);
    if (path) {
      navigate(path);
    }
  };

  // Navigate to Purchases by default
  useEffect(() => {
    navigate(`/purchases/${companyId}`);
  }, [companyId, navigate]);

  return (
    <div>
      <div className="top-header">
      <Box className="purchase-header">
        <Box className="purchase-header-left">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Button
            onClick={handleMenuClick}
            className="purchase-menu-button"
            sf={{ fontWeight: 'bold', color: '#597C26'}}
            endIcon={<ArrowDropDownIcon />
            }
          >
            Purchases
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleMenuClose()}
            className="menuContainer"
          >
            <MenuItem className="menuItem" onClick={() => handleMenuClose(`/purchases/${companyId}`)}>Purchases</MenuItem>
            <MenuItem className="menuItem" onClick={() => handleMenuClose(`/sales/${companyId}`)}>Sales</MenuItem>
            <MenuItem className="menuItem" onClick={() => handleMenuClose(`/suppliers/${companyId}`)}>Suppliers</MenuItem>
          </Menu>
        </Box>
        <Box className="purchase-tabs">
          <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary">
            <Tab label="Inbox" value="inbox" icon={<InboxIcon />} iconPosition="start" />
            <Tab label="Processing" value="pending" icon={<PendingIcon />} iconPosition="start" />
            <Tab label="Rejected" value="rejected" icon={<RejectedIcon />} iconPosition="start" />
          </Tabs>
        </Box>
      </Box>
      </div>
     
      <TableContainer component={Paper} className="purchase-table-container" sx={{ border: '1px solid #ccc', marginTop: '20px' }}>
  <Table sx={{ minWidth: 650 }} aria-label="purchases table">
    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>View</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Date</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Supplier Name</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Supplier Account</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Category</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>VAT Code</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Currency</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Net</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>VAT</b>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
          <b>Total</b>
        </TableCell>
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
                sx={{
                  backgroundColor: '#86B049',
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#558B2F' },
                }}
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
