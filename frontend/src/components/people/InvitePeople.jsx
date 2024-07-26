import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InvitePeople.css";

const InvitePeople = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState({ id: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (error.response && error.response.data.name === 'TokenExpiredError') {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !selectedCompany.id) {
      toast.error("Please enter an email and select a company.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem("token");
      const admin = localStorage.getItem("adminName");
      const role = localStorage.getItem("role");

      if (role !== 'admin') {
        toast.error("Access denied. Only admins can invite people.");
        setIsSubmitting(false);
        return;
      }
      
      const response = await axios.post(
        "http://localhost:3000/api/user/invite",
        { email, companyId: selectedCompany.id, admin, company: selectedCompany.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      // Check if the response status is successful (200-299)
      if (response.status >= 200 && response.status < 300) {
        toast.success("Invitation sent successfully!");
        setEmail("");
        setSelectedCompany({ id: "", name: "" });
      } else {
        // If the response status is not successful, log and show an error
        console.error("Error sending invitation with response status:", response.status);
        toast.error("Error sending invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Error sending invitation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <div className="invitepeople-backdrop">
        <div className="invitepeople-content">
          <div className="invitepeople-header">
            <div className="invitepeople-header-left">
              <h2 className="invitepeople-title">Invite People</h2>
            </div>
            <div className="invitepeople-header-right">
              <button className="close-button-invitepeople" onClick={handleClose}>
                &times;
              </button>
            </div>
          </div>
          <hr className="divider-invite" />
          <form className="invitepeople-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="company-select">Choose a Company</label>
              <select
                id="company-select"
                value={selectedCompany.id}
                onChange={(e) => {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  const selectedCompany = {
                    id: selectedOption.value,
                    name: selectedOption.text
                  };
                  setSelectedCompany(selectedCompany);
                }}
                required
              >
                <option value="">Select a Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Inviting..." : "Invite"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvitePeople;
