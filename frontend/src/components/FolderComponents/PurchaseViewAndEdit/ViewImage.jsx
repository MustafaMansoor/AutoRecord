import React, { useState, useRef } from "react";
import "./ViewImage.css";
import { FaSearchPlus, FaSearchMinus, FaSyncAlt } from "react-icons/fa";

function ViewImage({ URL }) {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default behavior to avoid issues like text selection
    setIsDragging(true);
    setDragStart({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <div
      className="viewImage-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={URL}
        alt="Purchase"
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          cursor: isDragging ? "grabbing" : "grab",
          position: "relative",
          left: `${dragOffset.x}px`,
          top: `${dragOffset.y}px`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        draggable="false" // Prevent the default drag behavior of the image
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
