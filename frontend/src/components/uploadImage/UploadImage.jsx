import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UploadImage.css";

const cloudinary = new Cloudinary({ cloud: { cloudName: "dkxbixsze" } });

const UploadImage = ({ show, handleClose }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ["purchase", "sales", "suppliers"];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/companies");
        setCompanies(response.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!selectedImage || !selectedCompany || !selectedCategory) {
      toast.error("Please select a company, category, and image.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "wmxcw7t4");
    formData.append("cloud_name", "dkxbixsze");

    try {
      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dkxbixsze/image/upload",
        formData
      );
      const uploadedImageUrl = uploadResponse.data.url;

      const apiResponse = await axios.post("http://localhost:3000/api/upload", {
        imageUrl: uploadedImageUrl,
        company: selectedCompany,
        category: selectedCategory,
      });

      console.log("API Response:", apiResponse.data);

      // Display success toast
      toast.success("Success: Document uploaded successfully!");

      // Reset form
      setSelectedCompany("");
      setSelectedCategory("");
      setSelectedImage(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);

      // Display failure toast
      toast.error("Error: Failed to upload document.");
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <div className="UploadImage-backdrop">
        <div className="UploadImage-content">
          <div className="UploadImage-header">
            <div className="UploadImage-header-left">
              <h2 className="UploadImage-title">Upload Document</h2>
            </div>
            <div className="UploadImage-header-right">
              <button
                className="close-button-UploadImage"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
          </div>
          <hr className="divider-upload" />

          <div className="form-group">
            <label htmlFor="company-select">Choose a company:</label>
            <select
              id="company-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category-select">Choose a category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div
            className="drag-drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            {selectedImage
              ? selectedImage.name
              : "Drag and drop an image here or click to upload"}
            <input
              type="file"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadImage;
