import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (path) => {
    setAnchorEl(null);
    if (path) {
      navigate(path);
    }
  };

  return { handleMenuClick, handleMenuClose, anchorEl };
};

export default useNavigationHandlers;
