import React, { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import './login.css';
import AuthContext from '../context/AuthContext';

function Loginpage() {
  const { loginUser } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [National_ID, setNational_ID] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = e => {
    e.preventDefault();
    National_ID.length > 0 && loginUser(National_ID, password);
    console.log(National_ID);
    console.log(password);
  };

  useEffect(() => {
    document.body.classList.add('signup-background');
    return () => {
      document.body.classList.remove('signup-background');
    };
  }, []);

  return (
    <div className="login-container">
      <h1 id="login-title">Login as school principal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="National ID"
          className="login-input"
          id="login-input1"
          value={National_ID}
          onChange={(e) => setNational_ID(e.target.value)}
        />
        <div className="password">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={togglePasswordVisibility} className="eye-button">
            {passwordVisible ? <FaEyeSlash id="eye-icon" /> : <FaEye id="eye-icon" />}
          </button>
        </div>
        <button type="submit" className="login-button">Log in</button>
      </form>
      <p className="signup-link">
        New Principal? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Loginpage;
