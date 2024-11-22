import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../context/TeacherContext';
import './classes.css';

const TeacherClassList = () => {
  const navigate = useNavigate();
  const { teacher, _ } = useTeacher();
  const [classes, getClasses] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const token = teacher?.jwt;

  const handleShowSchedule = () => {
    setShowSchedule(!showSchedule);
  };
  const generateTimeTable = () => {
    const days = ['Saturday','Sunday','Monday', 'Tuesday', 'Wednesday'];
    const periods = ['8:00 to 9:00', '9:15 to 10:15', '10:30 to 11:30', '11:45 to 12:45', '13:00 to 14:00'];
    const timeTable = {};

    days.forEach(day => {
      timeTable[day] = {};
      periods.forEach(period => {
        timeTable[day][period] = '';
      });
    });

    // Fill timetable with class data
    classes.forEach(cls => {
      const [day, period] = [cls.Session1Day, cls.Session1Time];
      if (timeTable[day] && timeTable[day][period]) {
        timeTable[day][period] += ` / ${cls.Topic}`; // If there's already a class, append this class Topic
      } else {
        timeTable[day][period] = cls.Topic;
      }
      const [day2, period2] = [cls.Session2Day, cls.Session2Time];
      if (timeTable[day2] && timeTable[day2][period2]) {
        timeTable[day2][period2] += ` / ${cls.Topic}`; // If there's already a class, append this class Topic
      } else {
        timeTable[day2][period2] = cls.Topic;
      }
    });
    return (
      <table className="timetable">
        <thead>
          <tr>
            <th>Time\Day</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <tr key={period}>
              <td>{period}</td>
              {days.map(day => (
                <td key={day}>
                  {timeTable[day][period]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
    document.body.classList.add('classes-list');
    return () => {
      document.body.classList.remove('classes-list');
    };
  }, [token,fetchClassesData]);

  const backToHome = () => {
    navigate('/teacher-dashboard');
};
return (
  <div className="student-classes">
    <h1>Your Classes</h1>
    <div className="class-grid">
      {classes.map(cls => (
        <div key={cls.id} className="class-box">
          <h2>{cls.Topic}</h2>
          <p>{cls.Session1Day} {cls.Session1Time}</p>
          <p>{cls.Session2Day} {cls.Session2Time}</p>
        </div>
      ))}
    </div>
    <button onClick={backToHome}>
      Back to Home
    </button>
    <button onClick={handleShowSchedule}>
      {showSchedule ? 'Hide Weekly Schedule' : 'Show Weekly Schedule'}
    </button>
    {showSchedule && (
      <div className="weekly-schedule">
        <h2>Weekly Schedule</h2>
        {generateTimeTable()}
      </div>
    )}
  </div>
);
};

export default TeacherClassList;
