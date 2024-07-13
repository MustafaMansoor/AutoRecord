import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PurchaseEditImageDetails.css";
import CustomButton from "../../dashboard/Button";
import HollowTickIcon from "@mui/icons-material/CheckCircleOutline";
import HollowExclamationTriangleIcon from "@mui/icons-material/WarningAmberOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

const vatOptions = [
  { label: "Sales Standard Rated - 20%", value: "20" },
  { label: "Sales Zero Rated - 0%", value: "0" },
  { label: "Sales C&S Sports - 5%", value: "5" },
];

function EditImageDetails({ data }) {
  const [formData, setFormData] = useState(data);
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const vatPercentage = (formData.vat / formData.net) * 100;
    const matchedOption = vatOptions.find(
      (option) => parseFloat(option.value) === vatPercentage
    );
    if (matchedOption) {
      setFormData((prevData) => ({
        ...prevData,
        vatCode: matchedOption.value,
      }));
    }
  }, [formData.vat, formData.net]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(status) {
    const updatedData = { ...formData, status };
    const purchaseId = formData._id;

    try {
      const response = await fetch(
        `http://localhost:3000/api/companies/${companyId}/purchases/${purchaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

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

  async function handleDelete() {
    const purchaseId = formData._id;

    try {
      const response = await fetch(
        `http://localhost:3000/api/companies/${companyId}/purchases/${purchaseId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate(-1); // Navigate back after deletion
      } else {
        console.error("Failed to delete purchase");
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
              <label>Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
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

          <div className="form-row">

            <div className="form-group">
              <label>Currency</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
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
              <select
                name="vatCode"
                value={formData.vatCode}
                onChange={handleInputChange}
              >
                {vatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
          icon={<DeleteIcon />}
          text="Delete"
          onClick={() => handleDelete()}
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
