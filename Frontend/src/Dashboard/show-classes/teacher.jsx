import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../context/TeacherContext';

const StudentClassList = () => {
  const navigate = useNavigate();
  const { teacher, logoutStudent } = useTeacher();
  const [classes, getClasses] = useState([]);
  const token = teacher?.jwt;

  const fetchClassesData = useCallback(async () => {
    try {
      const fetchclassresponse = await fetch("http://127.0.0.1:8080/teacher/classes/", {
        headers: {
          'Content-Type': 'application/json',
           //Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (fetchclassresponse.ok) {
        const classData = await fetchclassresponse.json();
        getClasses(classData)
      } else {
        console.error('Failed to fetch class list');
      }
    } catch (error) {
      console.error('Error fetching class list:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchClassesData();
    }
  }, [token,fetchClassesData]);

  const backToHome = () => {
    navigate('/teacher-dashboard');
};
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Classes</h2>
        <p>You can see your classes in here.</p>
      <table className="class-list">
        <thead>
          <tr>
            <th>Class ID</th>
            <th>Class Name</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.Topic}</td>
              <td>{cls.Teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={backToHome} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Back to home.
      </button>
    </div>
  );
};

export default StudentClassList;
