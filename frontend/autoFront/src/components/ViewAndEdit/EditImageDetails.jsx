import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditImageDetails.css";
import CustomButton from "../dashboard/Button";
import HollowTickIcon from "@mui/icons-material/CheckCircleOutline";
import HollowExclamationTriangleIcon from "@mui/icons-material/WarningAmberOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";

function EditImageDetails({ data }) {
  const [formData, setFormData] = useState(data);
  const { companyId} = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(status) {
    const updatedData = { ...formData, status };
    const purchaseId = formData._id;

    try {
      const response = await fetch(`http://localhost:3000/api/companies/${companyId}/purchases/${purchaseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        navigate(-1);
      } else {
        console.error("Error:", updatedData);
        console.error("Failed to update purchase");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toISOString().substr(0, 10) : "";
  };

  return (
    <div className="edit-page-main-container">
      <div className="edit-page-form-container">
        <form className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Supplier A/C</label>
              <input
                type="text"
                name="supplierAccount"
                value={formData.supplierAccount}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formatDate(formData.date)}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formatDate(formData.dueDate)}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <hr className="divider" />
          <div className="form-row">
            <div className="form-group">
              <label>Net</label>
              <input
                type="number"
                name="net"
                value={formData.net}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>VAT</label>
              <input
                type="number"
                name="vat"
                value={formData.vat}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>VAT Code</label>
              <input
                type="text"
                name="vatCode"
                value={formData.vatCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>
      <div className="edit-page-footer buttons">
        <CustomButton
          icon={<ArchiveIcon />}
          text="Archive"
          onClick={() => handleSubmit("archived")}
        />
        <CustomButton
          icon={<HollowExclamationTriangleIcon />}
          text="Reject"
          onClick={() => handleSubmit("rejected")}
        />
        <CustomButton
          icon={<HollowTickIcon />}
          text="Approve and Next"
          onClick={() => handleSubmit("inbox")}
        />
      </div>
    </div>
  );
}

export default EditImageDetails;
