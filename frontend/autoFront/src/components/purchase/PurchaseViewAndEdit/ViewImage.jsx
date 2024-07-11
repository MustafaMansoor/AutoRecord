import React, { useState } from "react";
import "./ViewImage.css";
import { FaSearchPlus, FaSearchMinus, FaSyncAlt } from "react-icons/fa";

function ViewImage({ URL }) {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const zoomIn = () => {
    if (scale < 5) {
      setScale(scale + 0.1);
    }
  };

  const zoomOut = () => {
    if (scale > 1) {
      setScale(scale - 0.1);
    }
  };

  const rotateImage = () => {
    setRotate(rotate + 90);
  };

  return (
    <div className="viewImage-container">
      <img
        src={URL}
        alt="Purchase"
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
        }}
      />

      <div className="viewImage-overlay">
        <button onClick={zoomIn}>
          <FaSearchPlus />
        </button>
        <button onClick={zoomOut}>
          <FaSearchMinus />
        </button>
        <button onClick={rotateImage}>
          <FaSyncAlt />
        </button>
      </div>
    </div>
  );
}

export default ViewImage;
