import React from 'react';
import './AddCompany.css';

const AddCompany = ({ show, handleClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="addcompany-backdrop">
      <div className="addcompany-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddCompany;
