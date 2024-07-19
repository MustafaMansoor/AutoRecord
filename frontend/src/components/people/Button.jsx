import React from 'react';
import './Button.css';

const Button = ({ icon, text,onClick }) => {
  return (
    <button className="button"  onClick={onClick}>
      {icon && <span className="button-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
