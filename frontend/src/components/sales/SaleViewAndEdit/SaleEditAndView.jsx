import "./SaleViewAndEdit.css";
import { useLocation } from "react-router-dom";
import ViewImage from "../../FolderComponents/PurchaseViewAndEdit/ViewImage";
import EditSaleImageDetail from "./EditSaleImageDetail";
import { Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from 'lucide-react';

function SaleEditAndView() {
  const location = useLocation();
  const { item:sales } = location.state || {};

  if (!sales) {
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
          {sales.status}
        </Typography>
</div>

<div className="SaleEditAndView-container">
      <div className="SaleEditAndView-container-first">
        <EditSaleImageDetail data={sales} />
      </div>
      <div className="SaleEditAndView-container-second">
        <ViewImage URL={sales.imageURL} />
      </div>
    </div>


    </div>
    
  );
}

export default SaleEditAndView;
