import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  Paper, Avatar, Box
} from '@mui/material';
import Swal from "sweetalert2";
import { styled } from '@mui/system';

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

// کامپوننت کوچک برای نمایش یک دانش‌آموز در یک ردیف قشنگ‌تر
const StudentItem = ({ student, onClick }) => {
  return (
    <Paper
      onClick={onClick} // اگر نیازی به کلیک دارید
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        borderRadius: 2,
        cursor: 'pointer',
        backgroundColor: '#fafafa',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#f1f1f1',  // افکت هوور
        },
        // فاصله‌ی بین ردیف‌های دانش‌آموز
        marginBottom: 2,
      }}
      elevation={3}
    >
      <Avatar
        src={
          student.profile_image
            ? `http://127.0.0.1:8000/api${student.profile_image}`
            : "/default-avatar.png"
        }
        alt={`${student.first_name} ${student.last_name}`}
        sx={{ width: 56, height: 56, marginRight: 2 }}
      />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {student.first_name} {student.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {student.National_ID}
        </Typography>
      </Box>
    </Paper>
  );
};

const ClassList = ({ gotoplanning }) => {
  const [studentList, setStudentList] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      // گرفتن لیست دانش‌آموزان
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/teacher/class-students/`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        Swal.fire('Error', 'Failed to fetch student list', 'error');
        setIsLoading(false);
        return;
      }

      const data = await response.json(); 

      // گرفتن عکس هر دانش‌آموز به صورت جداگانه
      await Promise.all(
        Object.keys(data).map(async (key) => {
          const student = data[key];
          try {
            const picRes = await fetch(
              "http://127.0.0.1:8000/portfolio/StudentPicture_TeacherSideView/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ National_ID: student.National_ID }),
              }
            );
            if (picRes.ok) {
              const picData = await picRes.json();
              student.profile_image = picData.profile_image; 
            } else {
              student.profile_image = null;
            }
          } catch (err) {
            student.profile_image = null;
            console.error("Error fetching image for student:", err);
          }
        })
      );

      setStudentList(data);
    } catch (error) {
      Swal.fire('Error', 'Error fetching student list', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <ContainerStyled>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Watch planning of these students
          </Typography>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container>
              {/* اگر دانش‌آموز داریم */}
              {Object.keys(studentList).length > 0 ? (
                Object.keys(studentList)
                  .sort((a, b) => 
                    studentList[a].last_name.localeCompare(studentList[b].last_name)
                  )
                  .map((National_ID) => {
                    const student = studentList[National_ID];
                    return (
                      <Grid item xs={12} key={National_ID}>
                        <StudentItem
                          student={student}
                          onClick={() => gotoplanning(student.id)}
                        />
                      </Grid>
                    );
                  })
              ) : (
                <Typography>No students in this class</Typography>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    </ContainerStyled>
  );
};

export default ClassList;
