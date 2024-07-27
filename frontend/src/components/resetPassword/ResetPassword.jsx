/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/user/update-password", {
        token,
        newPassword,
      });
      toast.success("Password updated successfully");
      // wait for 3 seconds and then navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid or missing token");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [navigate]);

  return (
    <div className="main-body">
      <ToastContainer />
      <div className="login-container reset-container">
        <div className="login-form-container reset-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-h1">Reset Password</h1>
            <input
              className="login-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="login-button" type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
