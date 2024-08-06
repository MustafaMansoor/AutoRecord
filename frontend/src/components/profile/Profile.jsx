import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css"; // Create and import a CSS file for styling

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfile({
          username: data.username,
          email: data.email,
          role: data.role,
          password: "", // Not fetched, just a placeholder for the update
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (
          error.response &&
          error.response.data.name === "TokenExpiredError"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/user/update",
        {
          username: profile.username,
          password: profile.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <Typography variant="h5" gutterBottom>
        Profile Details
      </Typography>
      <div className="profile-field">
        <TextField
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div className="profile-field">
        <TextField
          label="Password"
          name="password"
          type="password"
          value={profile.password}
          onChange={handleChange}
          fullWidth
        />
      </div>
      <div className="profile-field">
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          disabled
        />
      </div>
      <div className="profile-field">
        <TextField
          label="Role"
          name="role"
          value={profile.role}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          disabled
        />
      </div>
      <div className="profile-field">
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "#86B049",
            color: "#fff",
            textTransform: "none",
            "&:hover": { backgroundColor: "#648435" },
          }}
        >
          Save Changes
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
