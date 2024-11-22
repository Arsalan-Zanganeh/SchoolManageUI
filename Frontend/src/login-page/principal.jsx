import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usePrincipal } from '../context/PrincipalContext';  
import './login.css';

function Loginpage() {
  const navigate = useNavigate();
  const { loginPrincipal } = usePrincipal(); 
  const [National_ID, setNational_ID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/api/login/", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ National_ID, password }),
      });
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        loginPrincipal(data); 
        navigate('/admin-school');  
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
      <h1 id="login-title">Login as School Principal</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-fields">
          <input
            type="text"
            placeholder="National ID"
            className="login-input"
            id="login-input1"
            value={National_ID}
            onChange={(e) => setNational_ID(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="password-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={showPassword} 
              onChange={togglePasswordVisibility} 
              className="show-password-checkbox" 
            />
            Show Password
          </label>
        </div>
        <button type="submit" className="login-button">Log in</button>
      </form>
    </div>
  );
}

export default Loginpage;
