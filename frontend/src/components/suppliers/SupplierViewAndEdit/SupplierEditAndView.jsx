import "./SupplierViewAndEdit.css";
import { useLocation } from "react-router-dom";
import ViewImage from "../../FolderComponents/PurchaseViewAndEdit/ViewImage";
import EditSupplierImageDetail from "./EditSupplierImageDetail";
import { Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from 'lucide-react';

function SupplierEditAndView() {
  const location = useLocation();
  const { item:suppliers } = location.state || {};

  if (!suppliers) {
    return <div>No data available</div>;
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
      <div className="AupplierEditAndView-container">
      <div className="SupplierEditAndView-container-first">
        <EditSupplierImageDetail data={suppliers} />
      </div>
      <div className="SupplierEditAndView-container-second">
        <ViewImage URL={suppliers.imageURL} />
      </div>
    </div>
      
    </div>
    
  );
}

export default SupplierEditAndView;
