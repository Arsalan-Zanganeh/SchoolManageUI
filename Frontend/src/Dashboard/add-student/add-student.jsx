import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './add-student.css';

function SignUpStudent() {
  //const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [fatherphone, setFatherPhoneNumber] = useState('');
  const [fatherfname, setFatherFirstName] = useState('');
  const [gradelevel, setGradeLevel] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [Email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landline, setLandLine] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!firstname || !lastname || !nationalid || !fatherphone || !password || !password2 || !fatherfname || !Email || !address || !landline || !gradelevel) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
  
    try {
      const submit = await fetch("http://127.0.0.1:8000/api/add_student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          National_ID: nationalid,
          Father_Phone_Number : fatherphone,
          password,
          password2,
          Email: Email,
          Father_first_name : fatherfname,
          Grade_Level : gradelevel,
          Address: address,
          LandLine: landline,
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
        //navigate('/principal-login');
      }
  
    } catch (error) 
    {
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
    setFatherPhoneNumber('');
    setFatherFirstName('');
    setPassword('');
    setPassword2('');
    setEmail('');
    setAddress('');
    setLandLine('');
    setGradeLevel('');
  };

  return (
    <div className="add-stu-container">
      <h1 className="add-stu-title">Add new student</h1>
      <form className="add-stu-form" onSubmit={handleSubmit}>
        <div className="add-form-section">
          <h2 className="section-title">Student's Information</h2>
          <div className="add-stu-form-group">
            <input
              type="text"
              placeholder="First Name"
              className="add-stu-input"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="add-stu-input"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <input
              type="text"
              placeholder="National ID"
              className="add-stu-input"
              value={nationalid}
              onChange={(e) => setNationalid(e.target.value)}
            />
          </div>
          <div className="add-stu-form-group">
            <input
              type="text"
              placeholder="Father Phone Number"
              className="add-stu-input"
              value={fatherphone}
              onChange={(e) => setFatherPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Father First Name"
              className="add-stu-input"
              value={fatherfname}
              onChange={(e) => setFatherFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Grade Level"
              className="add-stu-input"
              value={gradelevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            />
            
          </div>
          <div className="add-stu-form-group">
            <input
              type="password"
              placeholder="Password"
              className="add-stu-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="add-stu-input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />       
          </div>
          <div className="add-stu-form-group">
            <input type="text" 
            placeholder='Email'
            className="add-stu-input"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="add-stu-form-group">
            <textarea
              placeholder="Enter Home Address"
              rows="3"
              className="add-stu-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="add-stu-form-group">
            <textarea
              placeholder="Enter Land Line"
              className="add-stu-input"
              value={landline}
              onChange={(e) => setLandLine(e.target.value)}
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

export default SignUpStudent;