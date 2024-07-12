import "./SaleViewAndEdit.css";
import { useLocation } from "react-router-dom";
import ViewImage from "../../purchase/PurchaseViewAndEdit/ViewImage";
import EditSaleImageDetail from "./EditSaleImageDetail";
import { Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft } from 'lucide-react';

function SaleEditAndView() {
  const location = useLocation();
  const { sale } = location.state || {};

  if (!sale) {
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
          {sale.status}
        </Typography>
      </div>

<div className="SaleEditAndView-container">
      <div className="SaleEditAndView-container-first">
        <EditSaleImageDetail data={sale} />
      </div>
      <div className="SaleEditAndView-container-second">
        <ViewImage URL={sale.imageURL} />
      </div>
    </div>


    </div>
    
  );
}

export default SaleEditAndView;
