import "./PurchaseEditAndViewPage.css";
import { useLocation } from "react-router-dom";
import ViewImage from "./ViewImage";
import EditImageDetails from "./PurchaseEditImageDetails";
import { Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from 'lucide-react';

function PurchaseEditAndViewPage() {
  const location = useLocation();
  const { item:purchases } = location.state || {};

  if (!purchases) {
    return <div>No purchase data available</div>;
  }

  return (
    <div>
      <div className="top-bar">
        {/* Back Button */}
        <IconButton onClick={() => window.history.back()} aria-label="back">
          <ArrowLeft className="arrow"/>
        </IconButton>
        {/* Status Text */}
        <Typography variant="h6" className="status-text">
          {purchases.status}
        </Typography>
      </div>
      
      <div className="EditAndView-container">
        <div className="EditAndView-container-first">
          <EditImageDetails data={purchases} />
        </div>
        <div className="EditAndView-container-second">
          <ViewImage URL={purchases.imageURL} />
        </div>
      </div>
    </div>
  );
}

export default PurchaseEditAndViewPage;
