import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddCompany.css";

const AddCompany = ({ show, handleClose }) => {
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    const countryCurrencyMap = {
      USA: "USD",
      Canada: "CAD",
      UK: "GBP",
      Australia: "AUD",
      Japan: "JPY",
      Germany: "EUR",
      Switzerland: "CHF",
      // Add more countries and currencies as needed
    };
    setCurrency(countryCurrencyMap[e.target.value] || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      companyName: companyName,
      country: country,
      currency: currency,
      purchases: [],
      sales: [],
      suppliers: [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/companies/",
        data
      );
      console.log("Company added:", response.data);
      setIsLoading(false);
      setIsSuccess(true);
      setCompanyName("");
      setCountry("");
      setCurrency("");
      toast.success("Company created successfully!");
    } catch (error) {
      console.error("Error creating company:", error);
      setIsLoading(false);
      setIsSuccess(false);
      setError("Failed to create company.");
      toast.error("Error creating company. Please try again.");
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="addcompany-backdrop">
      <div className="addcompany-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2 className="addcompany-title">Add Company</h2>
        <hr className="divider" />
        <form className="addcompany-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              placeholder="ABC Corporation"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={handleCountryChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Germany">Germany</option>
              <option value="Switzerland">Switzerland</option>
              {/* Add more countries as needed */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <input type="text" id="currency" value={currency} readOnly />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Adding..." : "Submit"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCompany;
