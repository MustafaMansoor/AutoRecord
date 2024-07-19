import React, { useState } from "react";
import "./Topbar.css";
import CustomButton from "./Button";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import AddCompany from "../addcompany/AddCompany";
import UploadImage from "../uploadImage/UploadImage";

const Topbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const [openUploadImage, setopenUploadImage] = useState(false);

  const handleopenUploadImage = () => {
    setopenUploadImage(true);
  };
  return (
    <div className="topbar">
      <div>
        <CustomButton
          icon={<AddIcon />}
          text="Add Company"
          onClick={handleOpenModal}
        />
      </div>
      <div>
        <CustomButton
          icon={<UploadIcon />}
          text="Upload Document"
          onClick={handleopenUploadImage}
        />
      </div>

      <AddCompany show={showModal} handleClose={() => setShowModal(false)} />
      <UploadImage
        show={openUploadImage}
        handleClose={() => {
          setopenUploadImage(false);
        }}
      />
    </div>
  );
};

export default Topbar;
