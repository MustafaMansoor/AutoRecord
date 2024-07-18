/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { AuthContext } from "./Context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        try {
          console.log("Registering user:", {
            name,
            email,
            password,
            token,
          });
          const response = await axios.post(
            "http://localhost:3000/routes/register",
            { name, email, password, token }
          );
          console.log("Registered successfully:", response.data);
          alert("User registered successfully");
          handleToggle();
        } catch (error) {
          error.response.data.error;
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/user/login",
          {
            email,
            password,
          }
        );
        console.log("Logged in successfully:", response.data);
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
      setError(error.response.data.error);
    }
  };

  return (
    <div className="main-body">
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
            <a className="login-a" href="#">
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
            <input
              className="login-input"
              type="token"
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
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
              <h1 className="login-h1">Hello, Friend!</h1>
              <p className="login-p">
                Enter your personal details and start your journey with us
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
