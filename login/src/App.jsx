import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './App.css'

function App() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="login-holder">
        <h1 id="login-title">Login as school principal</h1>
        <input type="text" placeholder="Username" className="login-input" id="login-input1" />
        <div className="password">
          <input 
            type={passwordVisible ? "text" : "password"} 
            placeholder="Password" 
            className="login-input" 
          />
          <button type="button" onClick={togglePasswordVisibility} className="eye-button">
            {passwordVisible ? <FaEyeSlash id="eye-icon" /> : <FaEye id="eye-icon" />}
          </button>
        </div>
        <button className="login-button">Log in</button>
      </div>
    </>
  )
}

export default App;
