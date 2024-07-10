import "./SaleViewAndEdit.css";
import { useLocation } from "react-router-dom";
import ViewImage from "../../purchase/ViewAndEdit/ViewImage";

function SaleEditAndView() {
  const location = useLocation();
  const { sale } = location.state || {};

  if (!sale) {
    return <div>No data available</div>;
  }

  return (
    <div className="SaleEditAndView-container">
      <div className="SaleEditAndView-container-first">
        
      </div>
      <div className="SaleEditAndView-container-second">
        <ViewImage URL={sale.imageURL} />
      </div>
    </div>
  );
}

export default SaleEditAndView;
