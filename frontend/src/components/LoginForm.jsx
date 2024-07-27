/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { AuthContext } from "./Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext);

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/user/register",
            { name, email, password, token }
          );
          console.log("Registered successfully:", response.data);
          alert("User registered successfully");
          handleToggle();
        } catch (error) {
          setError(error.response.data.message);
        }
      } else {
        const loginData = { email, password };
        if (token) {
          loginData.token = token;
        }

        const response = await axios.post(
          "http://localhost:3000/api/user/login",
          loginData
        );
        console.log("Logged in successfully:", response.data);

        const { token: authToken, role, adminName } = response.data;
        localStorage.setItem("token", authToken);
        localStorage.setItem("role", role);
        localStorage.setItem("adminName", adminName);
        setIsAuthenticated(true); // Set isAuthenticated to true

        navigate("/");
      }
      // Reset form fields
      setEmail("");
      setPassword("");
      setName("");
      setToken("");
      setError("");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  // Fetch token from URL when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/reset-password",
        { email }
      );
      console.log("Reset password email sent:", response.data);
      toast.success("Reset password email sent");
    } catch (error) {
      toast.error(error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="main-body">
      <ToastContainer />
      <div
        className={`login-container ${isSignup ? "right-panel-active" : ""}`}
      >
        <div className="login-form-container sign-in-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-h1"> Sign In</h1>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a className="login-a" onClick={handleResetPassword}>
              Forgot your password?
            </a>
            <button className="login-button" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="login-form-container sign-up-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-h1">Sign Up</h1>
            <input
              className="login-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              onClick={() => setIsSignup(isSignup)}
              className="login-button signup-button"
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="login-overlay-container">
          <div className="login-overlay">
            <div className="login-overlay-panel login-overlay-left">
              <img className="logo" src="logo.svg" alt="Logo" />
              <h1 className="login-h1">Welcome Back!</h1>
              <p className="login-p">Please login with your personal info</p>
              <button
                className="ghost login-button"
                onClick={handleToggle}
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div className="login-overlay-panel login-overlay-right">
              <img className="logo" src="logo.svg" alt="Logo" />
              <h1 className="login-h1">AutoRecord</h1>
              <p className="login-p">
                Simplify invoice management with<br></br> AI-driven Accuracy
              </p>
              <button
                className="ghost login-button"
                onClick={handleToggle}
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        {error && <p className="error-message login-p">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
