import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Business } from '@mui/icons-material';
import axios from 'axios';
import Purchases from '../purchase/Purchase';

const CompanyTable = ({ companies }) => {
  const [showPurchase, setShowPurchase] = useState(false);

  const handlePurchase = () => {
    setShowPurchase(true);
  };
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const updatedCompanies = await Promise.all(companies.map(async (company) => {
        try {
          const [purchases, sales, suppliers] = await Promise.all([
            axios.get(`http://localhost:3000/api/companies/${company._id}/purchases`),
            axios.get(`http://localhost:3000/api/companies/${company._id}/sales`),
            axios.get(`http://localhost:3000/api/companies/${company._id}/suppliers`)
          ]);

          // Log the responses to check the structure
          console.log(`Purchases for company ${company._id}:`, purchases.data);
          console.log(`Sales for company ${company._id}:`, sales.data);
          console.log(`Suppliers for company ${company._id}:`, suppliers.data);

          return {
            ...company,
            purchasesCount: purchases.data.purchases ? purchases.data.purchases.length : 0,
            salesCount: sales.data.sales ? sales.data.sales.length : 0,
            suppliersCount: suppliers.data.suppliers ? suppliers.data.suppliers.length : 0
          };
        } catch (error) {
          console.error(`Error fetching details for company ${company._id}:`, error);
          return {
            ...company,
            purchasesCount: 0,
            salesCount: 0,
            suppliersCount: 0
          };
        }
      }));

      setCompanyData(updatedCompanies);
    };

    fetchCompanyDetails();
  }, [companies]);

  return (
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
          {companyData.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ marginRight: '8px', color: '#86B049' }} />
                  {company.companyName}
                </div>
              </TableCell>
              <TableCell>
                     <div onClick={handlePurchase} style={{ cursor: 'pointer' }}>
                     {company.purchasesCount}
                      </div>
                      {/* {showPurchase && <Purchases company={company} />} */}
              </TableCell>
              <TableCell>{company.salesCount}</TableCell>
              <TableCell>{company.suppliersCount}</TableCell>
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
  );
};

export default CompanyTable;
