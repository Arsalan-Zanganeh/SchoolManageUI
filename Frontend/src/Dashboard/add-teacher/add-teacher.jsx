import './signup.css';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function SignUpTeacher() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!firstname || !lastname || !nationalid || !phonenumber || !password || !password2 || !address) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
  
    try {
      const submit = await fetch("http://127.0.0.1:8000/api/add_teacher/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          National_ID: nationalid,
          Phone_Number: phonenumber,
          password,
          password2,
          Address: address,
        }),
      });

      if (!submit.ok) {
        const errorData = await submit.json();
  
        if (errorData) {
          let errorMessage = '';
          for (const key in errorData) {
            if (errorData.hasOwnProperty(key)) {
              errorMessage += `${key}: ${errorData[key].join(', ')}\n`;
            }
          }
          Swal.fire({
            title: 'Error',
            text: errorMessage || 'Registration failed. Please check the details and try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire('Error', 'An unknown error occurred. Please try again later.', 'error');
        }
      } else {
        Swal.fire('Success', 'Registration successful!', 'success');
        // navigate('/teacher-login');
      }
  
    } catch (error) {
      Swal.fire('Error', 'Server error or network issue. Please try again.', 'error');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    document.body.classList.add('signup-background');
    return () => {
      document.body.classList.remove('signup-background');
    };
  }, []);

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setNationalid('');
    setPhoneNumber('');
    setPassword('');
    setPassword2('');
    setAddress('');
  };

  return (
    <div className="signup-form-container">
      <h1 className="form-title">Sign Up as Teacher</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Teacher Information</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              className="signup-input"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="signup-input"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="National ID"
              className="signup-input"
              value={nationalid}
              onChange={(e) => setNationalid(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="signup-input"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="signup-input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Enter Home Address"
              rows="3"
              className="signup-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button type="button" className="reset-button" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpTeacher;
