import './signup.css';
import { useState, useContext , useEffect } from 'react';
import AuthContext from '../context/AuthContext'; 
import { Link } from 'react-router-dom'

function SignUp() {
  const { registerUser } = useContext(AuthContext);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [schoolname, setSchoolname] = useState('');
  const [schooltype, setSchooltype] = useState('');
  const [edulevel, setEdulevel] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    document.body.classList.add('signup-background');

    return () => {
      document.body.classList.remove('signup-background');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(
      firstname, 
      lastname, 
      nationalid, 
      phonenumber, 
      password, 
      password2, 
      schoolname, 
      schooltype, 
      edulevel, 
      province, 
      city, 
      address
    );
  };

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setNationalid('');
    setPhonenumber('');
    setPassword('');
    setPassword2('');
    setSchoolname('');
    setSchooltype('');
    setEdulevel('');
    setProvince('');
    setCity('');
    setAddress('');
  };

  return (
    <div className="signup-form-container">
      <h1 className="form-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        
        <div className="form-section">
          <h2 className="section-title">School Manager Information</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              className='signup-input'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className='signup-input'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="National ID"
              className='signup-input'
              value={nationalid}
              onChange={(e) => setNationalid(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className='signup-input'
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className='signup-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className='signup-input'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">School Information</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="School Name"
              className='signup-input'
              value={schoolname}
              onChange={(e) => setSchoolname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select
              value={schooltype}
              onChange={(e) => setSchooltype(e.target.value)}
            >
              <option value="">Select School Type</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <select
              value={edulevel}
              onChange={(e) => setEdulevel(e.target.value)}
            >
              <option value="">Select Education Level</option>
              <option value="primary">Primary</option>
              <option value="middle">Middle</option>
              <option value="high school">High School</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Province"
              className='signup-input'
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className='signup-input'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Enter School Address"
              rows="3"
              className='signup-input'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
        </div>
      </form>
      <p className="login-link">
        Have an account? <Link to="/principal-login">Log In</Link>
      </p>
    </div>
  );
}

export default SignUp;
