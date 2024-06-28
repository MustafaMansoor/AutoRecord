import React, { useState } from 'react';
import './Sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems = [
    { name: 'Home', icon: <HomeIcon /> },
    { name: 'People', icon: <PeopleIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
    { name: 'Profile', icon: <PersonIcon /> },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="logo.svg" alt="Logo" />
        <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={activeItem === item.name ? 'active' : ''}
            onClick={() => setActiveItem(item.name)}
          >
            <div className="icon">{item.icon}</div>
            <div className="text">{item.name}</div>
          </li>
        ))}
      </ul>
      </div>
      <div className="logout" onClick={() => setActiveItem('Sign Out')}>
        <div className="icon">
        <PowerSettingsNewIcon/>
        </div>
        <div className="text">Sign Out</div>
      </div>
    </div>
  );
};

export default Sidebar;
