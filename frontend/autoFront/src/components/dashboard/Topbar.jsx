import React, { useState } from 'react';
import './Topbar.css';
import CustomButton from './Button';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import AddCompany from '../addcompany/AddCompany';

const Topbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    console.log("clicked");
    setShowModal(true);
  };

  return (
    <div className="topbar">
      <CustomButton icon={<AddIcon />} text="Add Company" onClick={handleOpenModal} />
      <CustomButton icon={<UploadIcon />} text="Upload Document" />
      <AddCompany show={showModal} handleClose={() => setShowModal(false)}/>
    </div>
  );
};

export default Topbar;