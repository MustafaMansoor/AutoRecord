import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Folders.css"; // Import the CSS file
import InboxIcon from "@mui/icons-material/Inbox";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const Folders = () => {
  const { companyId } = useParams();
  const navigate = useNavigate(); // Use navigate hook
  const [counts, setCounts] = useState({
    purchases: { inbox: 0, rejected: 0, processing: 0 },
    sales: { inbox: 0, rejected: 0, processing: 0 },
    suppliers: { inbox: 0, rejected: 0, processing: 0 },
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [purchasesRes, salesRes, suppliersRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/companies/${companyId}/purchases`
          ),
          axios.get(`http://localhost:3000/api/companies/${companyId}/sales`),
          axios.get(
            `http://localhost:3000/api/companies/${companyId}/suppliers`
          ),
        ]);

        const calculateCounts = (items) => {
          const inbox = items.filter((item) => item.status === "inbox").length;
          const rejected = items.filter((item) => item.status === "rejected")
            .length;
          const processing = items.filter((item) => item.status === "pending")
            .length;
          return { inbox, rejected, processing };
        };

        setCounts({
          purchases: calculateCounts(purchasesRes.data.purchases),
          sales: calculateCounts(salesRes.data.sales),
          suppliers: calculateCounts(suppliersRes.data.suppliers),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, [companyId]);

  const handleNavigation = (type) => {
    navigate(`/${type}/${companyId}`);
  };

  const renderCard = (title, data, type) => (
    <div className="folder-card" onClick={() => handleNavigation(type)}>
      <div className="folder-card-content">
        <h3 className="folder-card-title">{title}</h3>
        <hr />
        <div className="folder-card-details-body">
          <div className="folder-status">
            <div className="folder-status-first-part">
              <InboxIcon className="folder-status-icon" />
            </div>
            <div className="folder-status-second-part">
              <span className="folder-status-text-style">Inbox</span>
            </div>
            <div className="folder-status-third-part">
              <span
                className="folder-status-text-style"
                style={{ color: "green" }}
              >
                {data.inbox}
              </span>
            </div>
          </div>
          <div className="folder-status">
            <div className="folder-status-first-part">
              <CancelOutlinedIcon className="folder-status-icon" />
            </div>
            <div className="folder-status-second-part">
              <span className="folder-status-text-style">Rejected</span>
            </div>
            <div className="folder-status-third-part">
              <span
                className="folder-status-text-style"
                style={{ color: "green" }}
              >
                {data.rejected}
              </span>
            </div>
          </div>
          <div className="folder-status">
            <div className="folder-status-first-part">
              <ScheduleIcon className="folder-status-icon" />
            </div>
            <div className="folder-status-second-part">
              <span className="folder-status-text-style">Processing</span>
            </div>
            <div className="folder-status-third-part">
              <span
                className="folder-status-text-style"
                style={{ color: "green" }}
              >
                {data.processing}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="folder-grid-container">
      {renderCard("Purchases", counts.purchases, "purchases")}
      {renderCard("Sales", counts.sales, "sales")}
      {renderCard("Suppliers", counts.suppliers, "suppliers")}
    </div>
  );
};

export default Folders;
