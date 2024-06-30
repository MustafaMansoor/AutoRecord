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
  const [isUploading, setIsUploading] = useState(false);

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
    if (!selectedImage || !selectedCompany || !selectedCategory) return;

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('upload_preset', 'wmxcw7t4');
    formData.append('cloud_name', 'dkxbixsze');

    setIsUploading(true);

    try {
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dkxbixsze/image/upload',
        formData
      );
      console.log('Uploaded Image URL:', uploadResponse.data.url);
      setUploadedImageUrl(uploadResponse.data.url);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImageUrl || !selectedCompany || !selectedCategory) return;

    try {
      const apiResponse = await axios.post('http://localhost:3000/api/upload', {
        imageUrl: uploadedImageUrl,
        company: selectedCompany,
        category: selectedCategory,
      });

      console.log('API Response:', apiResponse.data);
    } catch (error) {
      console.error('Error:', error);
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
          <button onClick={uploadImage} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        <div>
          <button onClick={handleSubmit} disabled={!uploadedImageUrl || isUploading}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
