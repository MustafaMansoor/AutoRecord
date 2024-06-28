import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Business } from '@mui/icons-material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Dashboard.css';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/companies');
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-center">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="companies table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Company Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Purchases</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Sales</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Suppliers</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>People</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ marginRight: '8px', color: '#86B049' }} />
                        {company.companyName}
                      </div>
                    </TableCell>
                    <TableCell>{company.purchases.join(', ')}</TableCell>
                    <TableCell>{company.sales.join(', ')}</TableCell>
                    <TableCell>{company.suppliers.join(', ')}</TableCell>
                    <TableCell>
                    <Button 
                        variant="contained"  
                        sx={{ backgroundColor: '#86B049', color: '#fff', textTransform: 'none','&:hover': { backgroundColor: '#558B2F'}}}>
                            View
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
