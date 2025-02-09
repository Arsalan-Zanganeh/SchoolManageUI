import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTeacher } from '../context/TeacherContext';
import './login.css';

function LoginTeacher() {
  const navigate = useNavigate();
  const { loginTeacher } = useTeacher();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [National_ID, setNationalID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/teacher/login/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          National_ID,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data);

        // Extract National_ID from JWT
        const jwt = data.jwt;
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        console.log('JWT payload:', payload);

        // Create teacher object with National_ID
        const teacherData = {
          National_ID: payload.National_ID,
          jwt: jwt
        };

        console.log('Teacher data to save:', teacherData);
        loginTeacher(teacherData);

        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        navigate('/teacher-dashboard');
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.detail || 'Invalid National_ID or password. Please try again.',
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
      <h1 id="login-title">Login as Teacher</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-fields">
          <input
            type="text"
            placeholder="National ID"
            className="login-input"
            id="login-input1"
            value={National_ID}
            onChange={(e) => setNationalID(e.target.value)}
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

export default LoginTeacher;
