import React from "react";
import "./EditImageDetails.css";
import CustomButton from "../dashboard/Button";
import HollowTickIcon from "@mui/icons-material/CheckCircleOutline";
import HollowExclamationTriangleIcon from "@mui/icons-material/WarningAmberOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
function EditImageDetails({ data }) {
  return (
    <div className="edit-page-main-container">
      <div className="edit-page-form-container">
        <form className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Supplier Name</label>
              <input type="text" value={data.supplierName} />
            </div>
            <div className="form-group">
              <label>Supplier A/C</label>
              <input type="text" value={data.supplierAccount} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={data.category} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={new Date(data.date).toISOString().substr(0, 10)}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={new Date(data.date).toISOString().substr(0, 10)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Description</label>
              <input type="text" value={data.description} />
            </div>
          </div>
          <hr className="divider" />

          <div className="form-row">
            <div className="form-group">
              <label>Net</label>
              <input type="number" value={data.net} />
            </div>
            <div className="form-group">
              <label>VAT</label>
              <input type="number" value={data.vat} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>VAT Code</label>
              <input type="text" value={data.vatCode} />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input type="number" value={data.total} />
            </div>
          </div>
        </form>
      </div>
      <div className="edit-page-footer buttons">
        <CustomButton icon={<ArchiveIcon />} text="Archive" />
        <CustomButton icon={<HollowExclamationTriangleIcon />} text="Reject" />
        <CustomButton icon={<HollowTickIcon />} text="Approve and Next" />
      </div>
    </div>
  );
}

export default EditImageDetails;
