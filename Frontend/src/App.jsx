import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignUp from './signup-page/signup'
import LoginPrincipal from './login-page/Principal';
import LoginStudent from './login-page/Student';
import LoginTeacher from './login-page/Teacher';
import './App.css';

function Navigation() {
  const location = useLocation();
  const isLoginRoute = location.pathname !== "/";

  return (
    !isLoginRoute && (
      <div className="main-container">
        <div>
          <h1 className="main-login-signup-title">Not joined? please sign up!</h1>
          <Link to="/signup"><button className="main-buttons">Sign Up</button></Link>
        </div>
        <div>
          <h1 className="main-login-signup-title">Login as...</h1>
          <div className="login-button-holder">
            <Link to="/principal-login"><button className="main-buttons">Login as Principal</button></Link>
            <Link to="/student-login"><button className="main-buttons">Login as Student</button></Link>
            <Link to="/teacher-login"><button className="main-buttons">Login as Teacher</button></Link>
          </div>
        </div>
      </div>
    )
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/principal-login" element={<LoginPrincipal />} />
        <Route path="/student-login" element={<LoginStudent />} />
        <Route path="/teacher-login" element={<LoginTeacher />} />
      </Routes>
    </Router>
  );
}

export default App;
