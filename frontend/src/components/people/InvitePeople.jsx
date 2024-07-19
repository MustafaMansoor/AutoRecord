import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InvitePeople.css";

const InvitePeople = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
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

    if (!email || !selectedCompany) {
      toast.error("Please enter an email and select a company.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/invite",
        { email, companyId: selectedCompany },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.success("Invitation sent successfully!");
      setEmail("");
      setSelectedCompany("");
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
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
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
