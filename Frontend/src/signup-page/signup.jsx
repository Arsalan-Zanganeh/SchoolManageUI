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
            <input type="text" placeholder="First Name" className='signup-input' />
            <input type="text" placeholder="Last Name" className='signup-input' />
          </div>
          <div className="form-group">
            <input type="text" placeholder="National ID" className='signup-input' />
            <input type="text" placeholder="Phone Number" className='signup-input' />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" className='signup-input' />
            <input type="password" placeholder="Confirm Password" className='signup-input' />
          </div>
        </div>

    
        <div className="form-section">
          <h2 className="section-title">School Information</h2>
          <div className="form-group">
            <input type="text" placeholder="School Name" className='signup-input' />
          </div>
          <div className="form-group">
            <select>
              <option value="">Select School Type</option>
              <option value="public" className='signup-input'>Public</option>
              <option value="private" className='signup-input'>Private</option>
            </select>
            <select>
              <option value="">Select Education Level</option>
              <option value="primary" className='signup-input'>Primary</option>
              <option value="middle" className='signup-input'>Middle</option>
              <option value="high" className='signup-input'>High School</option>
            </select>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Province" className='signup-input' />
            <input type="text" placeholder="City" className='signup-input' />
          </div>
          <div className="form-group">
            <textarea placeholder="Enter School Address" rows="3" className='signup-input'></textarea>
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
