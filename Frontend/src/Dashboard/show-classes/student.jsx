import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';
import { useClass } from '../../context/ClassContext';
import Swal from 'sweetalert2';
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

const StudentClassList = ({goBack}) => {
  const navigate = useNavigate();
  const { student } = useStudent();
  const { classToken, loginClass } = useClass(); // Use the class context

  const [classes, setClasses] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const studentToken = student?.jwt;

  const handleShowSchedule = () => {
    setShowSchedule(!showSchedule);
  };

  const generateTimeTable = () => {
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday'];
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
        timeTable[day][period] += `${cls.Topic}`; // If there's already a class, append this class Topic
      } else {
        timeTable[day][period] = cls.Topic;
      }
      const [day2, period2] = [cls.Session2Day, cls.Session2Time];
      if (timeTable[day2] && timeTable[day2][period2]) {
        timeTable[day2][period2] += `${cls.Topic}`; // If there's already a class, append this class Topic
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

  const fetchClassesData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/classes/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`, 
        },
        credentials: 'include',
      });

      if (response.ok) {
        const classData = await response.json();
        setClasses(classData);
      } else {
        console.error('Failed to fetch class list');
      }
    } catch (error) {
      console.error('Error fetching class list:', error);
      Swal.fire('Error', 'Failed to fetch classes', 'error'); 
    }
  };

  useEffect(() => {
    if (studentToken) {
      fetchClassesData();
    }
    document.body.classList.add('classes-list');
    return () => {
      document.body.classList.remove('classes-list');
    };
  }, [studentToken]); // Removed fetchClassesData from dependencies as it is not defined here

  const backToHome = () => {
    goBack()
  };

  const handleClassClick = async (id) => {
    try {
      const loginResponse = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-login-class/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
          credentials: "include",
        }
      );

      if (loginResponse.ok) {
        const token = await loginResponse.json();
        loginClass(token); 
        navigate(`/student-dashboard/student-classes/${id}`); 
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to login to the class. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const fetchGoogleMeetLink = async (classId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/meet/student-enter/`, {
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        const meetLink = data.message;
        window.open(meetLink, '_blank'); // باز کردن لینک گوگل میت در تب جدید
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch Google Meet link. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleClassLoginWithoutNavigate = async (id) => {
    try {
      const loginResponse = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-login-class/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
          credentials: "include",
        }
      );
  
      if (loginResponse.ok) {
        const token = await loginResponse.json();
        loginClass(token); 
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to login to the class. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  

  return (
    <div className="student-classes">
      <h1>Your Classes</h1>
      <div className="class-grid">
        {classes.length ? (classes.map(cls => (
          <div 
            key={cls.id} 
            className="class-box"
            onClick={() => handleClassClick(cls.id)} 
          >
            <h2>{cls.Topic}</h2>
            <p>{cls.Session1Day} {cls.Session1Time}</p>
            <p>{cls.Session2Day} {cls.Session2Time}</p>
            <button 
    className="enter-class-btn" 
    onClick={async (e) => {
      e.stopPropagation(); // جلوگیری از اجرای onClick کارت
      try {
        await handleClassLoginWithoutNavigate(cls.id); // ورود به کلاس
        await fetchGoogleMeetLink(cls.id); // دریافت لینک و باز کردن Google Meet
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to login or fetch Google Meet link. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }}
  >
    Join Class
  </button>
          </div>
        ))):(
          <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: "1.2rem",
          }}
        >
          You are not signed to any classes yet.
        </Typography>
      </Box>
    </Grid>
        )}
      </div>
      <button onClick={backToHome} className='show-cls-btn'>
        Back to Home
      </button>
      <button onClick={handleShowSchedule} className='show-cls-btn'>
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

export default StudentClassList;

