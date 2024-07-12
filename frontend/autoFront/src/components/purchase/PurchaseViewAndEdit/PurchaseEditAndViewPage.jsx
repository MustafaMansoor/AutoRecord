import "./PurchaseEditAndViewPage.css";
import { useLocation } from "react-router-dom";
import ViewImage from "./ViewImage";
import EditImageDetails from "./PurchaseEditImageDetails";
import { Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from 'lucide-react';

function PurchaseEditAndViewPage() {
  const location = useLocation();
  const { purchase } = location.state || {};

  if (!purchase) {
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
          {purchase.status}
        </Typography>
      </div>
      
      <div className="EditAndView-container">
        <div className="EditAndView-container-first">
          <EditImageDetails data={purchase} />
        </div>
        <div className="EditAndView-container-second">
          <ViewImage URL={purchase.imageURL} />
        </div>
      </div>
    </div>
  );
}

export default PurchaseEditAndViewPage;
