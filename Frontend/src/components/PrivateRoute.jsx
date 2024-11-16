import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePrincipal } from '../context/PrincipalContext';
import { useStudent } from '../context/StudentContext'; 
import { useTeacher } from '../context/TeacherContext'; 

const PrivateRoute = ({ children, role }) => {
  const { principal } = usePrincipal();
  const { student } = useStudent();
  const { teacher } = useTeacher();

  if (role === 'principal' && !principal) {
    return <Navigate to="/principal-login" />;
  }
  if (role === 'student' && !student) {
    return <Navigate to="/student-login" />;
  }
  if (role === 'teacher' && !teacher) {
    return <Navigate to="/teacher-login" />;
  }

  return children; 
};

export default PrivateRoute;
