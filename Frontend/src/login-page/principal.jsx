import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './login.css';
import axios from 'axios';

function Loginpage({ onLogin }) {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [National_ID, setNational_ID] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          National_ID,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        onLogin(data); 
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.detail || 'Invalid username or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Network error or server is unavailable. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
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
