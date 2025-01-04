import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClassDetails from './ClassDetail'; // جزئیات کلاس
import { useClass } from '../context/ClassContext'; // استفاده از کلاس کانتکست

const ParentClasses = ({ goBack }) => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null); // ذخیره کلاس انتخاب‌شده
  const { loginClass } = useClass(); // متد برای ذخیره توکن کلاس

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-classes/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
          fetchTeacherInfo(data);
        } else {
          console.error('Failed to fetch classes');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTeacherInfo = async (classData) => {
      const teacherData = {};
      for (const classItem of classData) {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/othersides-watch-teacher-info/`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: classItem.Teacher }),
          });
          if (response.ok) {
            const teacher = await response.json();
            teacherData[classItem.id] = teacher;
          }
        } catch (error) {
          console.error('Error fetching teacher info:', error);
        }
      }
      setTeachers(teacherData);
    };

    fetchClasses();
  }, []);

  const handleEnterClass = async (classItem) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-enter-class/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: classItem.id }),
      });

      if (response.ok) {
        const data = await response.json();
        const classToken = data.class;

        // ذخیره توکن کلاس در کانتکست
        loginClass(classToken);

        // نمایش جزئیات کلاس
        setSelectedClass(classItem);
      } else {
        console.error('Failed to enter the class');
      }
    } catch (error) {
      console.error('Error entering class:', error);
    }
  };

  if (selectedClass) {
    return <ClassDetails classItem={selectedClass} goBack={() => setSelectedClass(null)} />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: { xs: 'relative', sm: 'absolute' },
        left: { xs: '10px', sm: '190px' },
        right: { xs: '10px', sm: '20px' },
        width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 40px)' },
        maxWidth: { xs: '100%', sm: '1600px' },
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* دکمه بازگشت */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          variant="contained"
          color="primary"
          sx={{
            position: { sm: 'absolute' },
            left: { sm: 0 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          Back
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            width: '100%',
          }}
        >
          Manage Classes
        </Typography>
      </Box>

      <Grid container spacing={3}>
  {classes.map((classItem) => (
    <Grid item xs={12} sm={6} md={4} key={classItem.id}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
          },
          cursor: 'pointer',
        }}
        onClick={() => handleEnterClass(classItem)}
      >
        {/* عنوان کلاس */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
          {classItem.Topic}
        </Typography>

        {/* زمان جلسات */}
        <Typography variant="body1" color="textSecondary">
          {classItem.Session1Day} ({classItem.Session1Time})
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          {classItem.Session2Day} ({classItem.Session2Time})
        </Typography>

        {/* اطلاعات معلم */}
        {teachers[classItem.id] ? (
          <Box sx={{ textAlign: 'left', mt: 1 }}>
            <Typography variant="body2" color="textPrimary">
              <strong>Teacher:</strong> {teachers[classItem.id].first_name} {teachers[classItem.id].last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Email:</strong> {teachers[classItem.id].Email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Phone:</strong> {teachers[classItem.id].Phone_Number}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Loading teacher info...
          </Typography>
        )}
      </Paper>
    </Grid>
  ))}
</Grid>

    </Box>
  );
};

export default ParentClasses;
