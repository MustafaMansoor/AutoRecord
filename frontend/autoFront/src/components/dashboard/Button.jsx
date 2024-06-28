import React from 'react';
import './Button.css';

const Button = ({ icon, text }) => {
  return (
    <button className="button">
      {icon && <span className="button-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
