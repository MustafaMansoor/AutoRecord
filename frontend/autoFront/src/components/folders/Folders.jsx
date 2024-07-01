import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Folders.css"; // Import the CSS file
import InboxIcon from "@mui/icons-material/Inbox";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";

const Folders = () => {
  const { companyId } = useParams();
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

  const renderCard = (title, data) => (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <hr />
        <div className="card-details-body">
          <div className="status">
            <div className="status-first-part">
              <InboxIcon className="status-icon" />
            </div>
            <div className="status-second-part">
              <span className="status-text-style">Inbox</span>
            </div>
            <div className="status-third-part">
              <span className="status-text-style">{data.inbox}</span>
            </div>
          </div>
          <div className="status">
            <div className="status-first-part">
              <CancelIcon className="status-icon" />
            </div>
            <div className="status-second-part">
              <span className="status-text-style">Rejected</span>
            </div>
            <div className="status-third-part">
              <span className="status-text-style">{data.rejected}</span>
            </div>
          </div>
          <div className="status">
            <div className="status-first-part">
              <HourglassFullIcon className="status-icon" />
            </div>
            <div className="status-second-part">
              <span className="status-text-style">Processing</span>
            </div>
            <div className="status-third-part">
              <span className="status-text-style">{data.processing}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid-container">
      {renderCard("Purchases", counts.purchases)}
      {renderCard("Sales", counts.sales)}
      {renderCard("Suppliers", counts.suppliers)}
    </div>
  );
};

export default Folders;
