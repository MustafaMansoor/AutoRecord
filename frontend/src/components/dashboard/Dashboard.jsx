import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyTable from "./CompanyTable";
import "./Dashboard.css";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await axios.get("http://localhost:3000/api/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (error.response && error.response.data.name === 'TokenExpiredError') {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setIsAuthenticated(false);
        }
      }
    };

    fetchCompanies();
  }, [setIsAuthenticated]);

  return (
    <div className="content-center">
      <CompanyTable companies={companies} />
    </div>
  );
};

export default Dashboard;
