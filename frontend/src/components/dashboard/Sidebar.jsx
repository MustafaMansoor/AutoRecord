import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const menuItems = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "People", icon: <PeopleIcon />, path: "/people" },
    { name: "Profile", icon: <PersonIcon />, path: "/profile" },
  ];
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="sidebar">
      <div className="logo">
      <Link to="/">
        <img src="/logo.svg" alt="Logo" />
      </Link>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={activeItem === item.name ? "active" : ""}
              onClick={() => setActiveItem(item.name)}
            >
              <Link to={item.path} className="sidebar-link">
                <div className="icon">{item.icon}</div>
                <div className="text">{item.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="logout"
        onClick={() => {
          setActiveItem("Sign Out");
          handleLogout();
        }}
      >
        <div className="icon">
          <PowerSettingsNewIcon />
        </div>
        <div className="text">Sign Out</div>
      </div>
    </div>
  );
};

export default Sidebar;
