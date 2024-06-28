import React from 'react';
import './Topbar.css';
import CustomButton from './Button';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

const Topbar = () => {
  return (
    <div className="topbar">
      <CustomButton icon={<AddIcon />} text="Add Company" />
      <CustomButton icon={<UploadIcon />} text="Upload Document" />
    </div>
  );
};

export default Topbar;
