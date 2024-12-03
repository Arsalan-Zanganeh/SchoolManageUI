import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './add-teacher.css';

function SignUpTeacher() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
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
          Email: Email,
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
    setEmail('');
    setPassword('');
    setPassword2('');
    setAddress('');
  };

  return (
    <div className="add-teacher-container">
      <h1 className="add-teacher-title">Add new teacher</h1>
      <form className="add-teacher-form" onSubmit={handleSubmit}>
        <div className="add-form-section">
          <h2 className="section-title">Teacher's Information</h2>
          <div className="add-teacher-form-group">
            <input
              type="text"
              placeholder="First Name"
              className="add-teacher-input"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="add-teacher-input"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="add-teacher-form-group">
            <input
              type="text"
              placeholder="National ID"
              className="add-teacher-input"
              value={nationalid}
              onChange={(e) => setNationalid(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="add-teacher-input"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="add-teacher-form-group">
            <input
              type="password"
              placeholder="Password"
              className="add-teacher-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="add-teacher-input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          <div className="add-teacher-form-group">
            <input
              name="" id="" placeholder='Enter Email' rows="3"
              className="add-teacher-input"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}>
            </input>
          </div>
          </div>
          <div className="add-teacher-form-group">
            <textarea
              placeholder="Enter Home Address"
              rows="3"
              className="add-teacher-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="form-buttons add-stu-teacher-buttons">
          <button type="submit" className="submit-button add-stu-teacher-button">
            Submit
          </button>
          <button type="button" className="reset-button add-stu-teacher-button" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpTeacher;
