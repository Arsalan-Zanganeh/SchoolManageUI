import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignUpLogin from './signup-login/signup-login'
import LoginPrincipal from './login-page/principal';
import LoginStudent from './login-page/student';
import LoginTeacher from './login-page/Teacher';
import Dashboard from './Dashboard/Dashboard';
import StuDashboard from './Dashboard/StudentDashboard';
import TeacherDashboard from './Dashboard/TeacherDashboard';
import SignUpStudent from './Dashboard/add-student/add-student';
import SignUpTeacher from './Dashboard/add-teacher/add-teacher';
import AddClass from './Dashboard/add-class/AddClass';
import AdminSchoolPage from './Dashboard/AdminSchoolPage'; 
import StudentClassList from './Dashboard/show-classes/student'
import TeacherClassList from './Dashboard/show-classes/teacher'
import SchoolDashboard from './Dashboard/SchoolDashboard';
import ProfileAdmin from './Dashboard/ProfileAdmin';
import ProfileStudent from './Dashboard/ProfileStudent';
import ProfileTeacher from './Dashboard/ProfileTeacher';
import EditProfileAdmin from './Dashboard/EditProfileAdmin';
import EditProfileStudent from './Dashboard/EditProfileStudent';
import EditProfileTeacher from './Dashboard/EditProfileTeacher';
import ManageStudents from './Dashboard/ManageStudents'; // Import ManageStudents component
import { PrincipalProvider } from './context/PrincipalContext';
import { StudentProvider } from './context/StudentContext';
import { TeacherProvider } from './context/TeacherContext'; 
import PrivateRoute from './components/PrivateRoute';
import { SchoolProvider } from './context/SchoolContext';  
import './App.css';

function App() {
  return (
    <Router>
      <PrincipalProvider>
        <StudentProvider>
          <TeacherProvider>
            <SchoolProvider>
              <Routes>
                <Route path="/" element={<SignUpLogin/>} />
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
                  path="/dashboard/profile-student"
                  element={
                    <PrivateRoute role="student">
                      <ProfileStudent />
                    </PrivateRoute>
                  }
                />
                 <Route
                  path="/dashboard/profile-teacher"
                  element={
                    <PrivateRoute role="teacher">
                      <ProfileTeacher />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-admin"
                  element={
                    <PrivateRoute role="principal">
                      <EditProfileAdmin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-student"
                  element={
                    <PrivateRoute role="student">
                      <EditProfileStudent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-teacher"
                  element={
                    <PrivateRoute role="teacher">
                      <EditProfileTeacher />
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
                <Route
                  path="/dashboard/school/:schoolId/classes"
                  element={
                    <PrivateRoute role="principal">
                      <AddClass />
                    </PrivateRoute>
                  }
                />
                {/* اضافه کردن مسیر برای مدیریت دانش‌آموزان */}
                <Route
                  path="/dashboard/school/:schoolId/classes/manage_students/:clsId"
                  element={
                    <PrivateRoute role="principal">
                      <ManageStudents />
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
