import './signup.css';
import { useEffect } from 'react';

function SignUp() {
  useEffect(() => {
    document.body.classList.add('signup-background');

    return () => {
      document.body.classList.remove('signup-background');
    };
  }, []);
  return (
    <div className="signup-form-container">
      <h1 className="form-title">Sign Up</h1>
      <form className="signup-form">
        
        <div className="form-section">
          <h2 className="section-title">School Manager Information</h2>
          <div className="form-group">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="National ID" />
            <input type="text" placeholder="Phone Number" />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
          </div>
        </div>

    
        <div className="form-section">
          <h2 className="section-title">School Information</h2>
          <div className="form-group">
            <input type="text" placeholder="School Name" />
          </div>
          <div className="form-group">
            <select>
              <option value="">Select School Type</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <select>
              <option value="">Select Education Level</option>
              <option value="primary">Primary</option>
              <option value="middle">Middle</option>
              <option value="high">High School</option>
            </select>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Province" />
            <input type="text" placeholder="City" />
          </div>
          <div className="form-group">
            <textarea placeholder="Enter School Address" rows="3"></textarea>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="reset" className="reset-button">Reset</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
