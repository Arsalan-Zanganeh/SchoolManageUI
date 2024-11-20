import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignUp from './signup-page/signup';
import LoginPrincipal from './login-page/principal';
import LoginStudent from './login-page/student';
import LoginTeacher from './login-page/Teacher';
import Dashboard from './Dashboard/Dashboard';
import StuDashboard from './Dashboard/StudentDashboard';
import TeacherDashboard from './Dashboard/TeacherDashboard';
import SignUpStudent from './Dashboard/add-student/add-student';
import SignUpTeacher from './Dashboard/add-teacher/add-teacher';
import AdminSchoolPage from './Dashboard/AdminSchoolPage'; 
import StudentClassList from './Dashboard/show-classes/student'
import TeacherClassList from './Dashboard/show-classes/teacher'
import SchoolDashboard from './Dashboard/SchoolDashboard';
import ProfileAdmin from './Dashboard/ProfileAdmin'; // Import the ProfileAdmin component
import { PrincipalProvider } from './context/PrincipalContext';
import { StudentProvider } from './context/StudentContext';
import { TeacherProvider } from './context/TeacherContext'; 
import PrivateRoute from './components/PrivateRoute';
import { SchoolProvider } from './context/SchoolContext';  
import './App.css';

function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";  
  return (
    <div className="main-container">
      {isHomePage && (
        <>
          <h1 className="main-login-signup-title">Not joined? Please sign up!</h1>
          <Link to="/signup"><button className="main-buttons">Sign Up</button></Link>
          <h1 className="main-login-signup-title">Login as...</h1>
          <div className="login-button-holder">
            <Link to="/principal-login"><button className="main-buttons">Login as Principal</button></Link>
            <Link to="/student-login"><button className="main-buttons">Login as Student</button></Link>
            <Link to="/teacher-login"><button className="main-buttons">Login as Teacher</button></Link>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <PrincipalProvider>
        <StudentProvider>
          <TeacherProvider>
            <SchoolProvider>
              <Navigation />
              <Routes>
                <Route path="/" element={<div>Welcome to the homepage!</div>} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/principal-login" element={<LoginPrincipal />} />
                <Route path="/student-login" element={<LoginStudent />} />
                <Route path="/teacher-login" element={<LoginTeacher />} />
                <Route
                  path="/admin-school"
                  element={
                    <PrivateRoute role="principal">
                      <AdminSchoolPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute role="principal">
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/profile-admin"
                  element={
                    <PrivateRoute role="principal">
                      <ProfileAdmin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId/add-student"
                  element={
                    <PrivateRoute role="principal">
                      <SignUpStudent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId/add-teacher"
                  element={
                    <PrivateRoute role="principal">
                      <SignUpTeacher />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student-dashboard"
                  element={
                    <PrivateRoute role="student">
                      <StuDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student-dashboard/student-classes"
                  element={
                    <PrivateRoute role="student">
                      <StudentClassList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard"
                  element={
                    <PrivateRoute role="teacher">
                      <TeacherDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard/teacher-classes"
                  element={
                    <PrivateRoute role="teacher">
                      <TeacherClassList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId"
                  element={
                    <PrivateRoute role="principal">
                      <SchoolDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </SchoolProvider> 
          </TeacherProvider>
        </StudentProvider>
      </PrincipalProvider>
    </Router>
  );
}

export default App;
