import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import './UploadImage.css';

const cloudinary = new Cloudinary({ cloud: { cloudName: 'dkxbixsze' } });

const UploadImage = ({ show, handleClose }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const categories = ['purchase', 'sales', 'suppliers'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/companies');
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('upload_preset', 'wmxcw7t4'); 
    formData.append('cloud_name', 'dkxbixsze'); 

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dkxbixsze/image/upload',
        formData
      );
      console.log('Uploaded Image URL:', response.data.url);
      setUploadedImageUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="UploadImage-backdrop">
      <div className="UploadImage-content">
        <button className="close-button" onClick={handleClose}>&times;</button>
        <div>
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
        <div>
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
        <div>
          <label htmlFor="image-upload">Upload Image:</label>
          <input type="file" id="image-upload" onChange={handleImageChange} />
          <button onClick={uploadImage}>Upload Image</button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
