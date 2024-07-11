import "./SupplierViewAndEdit.css";
import { useLocation } from "react-router-dom";
import ViewImage from "../../purchase/PurchaseViewAndEdit/ViewImage";
import EditSupplierImageDetail from "./EditSupplierImageDetail";

function SupplierEditAndView() {
  const location = useLocation();
  const { supplier } = location.state || {};

  if (!supplier) {
    return <div>No data available</div>;
  }

  return (
    <div className="AupplierEditAndView-container">
      <div className="SupplierEditAndView-container-first">
        <EditSupplierImageDetail data={supplier} />
      </div>
      <div className="SupplierEditAndView-container-second">
        <ViewImage URL={supplier.imageURL} />
      </div>
    </div>
  );
}

export default SupplierEditAndView;
