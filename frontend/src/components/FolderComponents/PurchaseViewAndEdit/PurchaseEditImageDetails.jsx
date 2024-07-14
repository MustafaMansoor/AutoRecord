import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PurchaseEditImageDetails.css";
import CustomButton from "../../dashboard/Button";
import HollowTickIcon from "@mui/icons-material/CheckCircleOutline";
import HollowExclamationTriangleIcon from "@mui/icons-material/WarningAmberOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const vatOptions = [
  { label: "Sales Standard Rated - 20%", value: "20" },
  { label: "Sales Zero Rated - 0%", value: "0" },
  { label: "Sales C&S Sports - 5%", value: "5" },
];

function EditImageDetails({ data }) {
  const [formData, setFormData] = useState(data);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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

  async function handleSubmit(status, reason = "") {
    const updatedData = { ...formData, status, reason };
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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleReject = () => {
    handleSubmit("rejected", rejectionReason);
    handleDialogClose();
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
          onClick={handleDialogOpen}
        />
        <CustomButton
          icon={<HollowTickIcon />}
          text="Approve and Next"
          onClick={() => handleSubmit("inbox")}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Please Enter Reason of Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reject this purchase, please provide a reason for the rejection.
          </DialogContentText>
          <TextField
      autoFocus
      margin="dense"
      label="Rejection Reason"
      type="text"
      fullWidth
      variant="standard"
      value={rejectionReason}
      onChange={(e) => setRejectionReason(e.target.value)}
      sx={{
        '& .MuiInput-underline:before': {
          borderBottomColor: 'black',
        },
        '& .MuiInput-underline:hover:before': {
          borderBottomColor: 'black',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'black',
        },
        '& .MuiFormLabel-root.Mui-focused': {
          color: 'black',
        },
      }}
    />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: "#2f2f2f" }}>
            Cancel
          </Button>
          <Button onClick={handleReject} style={{ color: "#2f2f2f" }}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditImageDetails;
