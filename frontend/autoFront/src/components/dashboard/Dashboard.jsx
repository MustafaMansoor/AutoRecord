import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CompanyTable from './CompanyTable';
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
          <CompanyTable companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
