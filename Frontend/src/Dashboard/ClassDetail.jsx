import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ClassDetails = ({ classItem, goBack }) => {
  const [quizRecords, setQuizRecords] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, homeworkRes, attendanceRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-quiz-records/`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-see-homeworks/`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-attendance/`, { credentials: 'include' }),
        ]);

        if (quizRes.ok) setQuizRecords(await quizRes.json());
        if (homeworkRes.ok) setHomeworks(await homeworkRes.json());
        if (attendanceRes.ok) {
          const allAttendance = await attendanceRes.json();
          const filteredAttendance = allAttendance.filter(
            (record) => record.Topic === classItem.Topic
          );
          setAttendance(filteredAttendance);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classItem.Topic]);

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
        //width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 40px)' },
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
      {/* هدر: دکمه و عنوان */}
      <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' }, // موبایل: عمودی - دسکتاپ: افقی
    alignItems: 'center', // تراز عمودی
    justifyContent: { sm: 'center' }, // تراز افقی در حالت دسکتاپ
    position: 'relative',
    mb: 3,
    width: '100%',
    textAlign: 'center',
  }}
>
  {/* دکمه در سمت چپ */}
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={goBack}
    variant="contained"
    color="primary"
    sx={{
      mb: { xs: 2, sm: 0 }, // فاصله در حالت موبایل
      position: { sm: 'absolute' },
      left: { sm: 0 }, // چپ چین در دسکتاپ
    }}
  >
    Back to Classes
  </Button>

  {/* عنوان در مرکز */}
  <Box sx={{ flexGrow: 1 }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        textAlign: 'center', // تراز دقیق وسط
      }}
    >
      {classItem.Topic} Details
    </Typography>
  </Box>
</Box>




      {/* نمایش اطلاعات در جدول */}
      <Grid container spacing={3}>
        {/* Quiz Records */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '16px', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              Quiz Records
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Degree</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizRecords.length > 0 ? (
                    quizRecords.map((quiz, index) => (
                      <TableRow key={index}>
                        <TableCell>{quiz.Title}</TableCell>
                        <TableCell>{quiz.Degree}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No quiz records available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Homeworks */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '16px', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              Homeworks
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {homeworks.length > 0 ? (
                    homeworks.map((homework, index) => (
                      <TableRow key={index}>
                        <TableCell>{homework.Title}</TableCell>
                        <TableCell>
                          {homework.Graded ? `Grade: ${homework.Grade}` : 'Not Graded'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No homework records available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Attendance */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '16px', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              Attendance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.length > 0 ? (
                    attendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.Date}</TableCell>
                        <TableCell>{record.Absent === 'True' ? 'Absent' : 'Present'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No attendance records for this class.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClassDetails;
