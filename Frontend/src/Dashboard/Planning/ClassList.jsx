import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Grid, Paper, Button, Card, CardContent
} from '@mui/material';
import Swal from "sweetalert2";
import { styled } from '@mui/system';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Person as PersonIcon } from '@mui/icons-material';

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  justifyContent: 'flex-start',
  textAlign: 'left',
  width: '100%',
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const IconStyled = styled(PersonIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ClassList = ({ gotoplanning }) => {
  const [studentList, setStudentList] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/teacher/class-students/", {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStudentList(data);
      } else {
        Swal.fire('Error', 'Failed to fetch student list', 'error');
      }
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
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Watch planning of these students
          </Typography>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={2}>
              {Object.keys(studentList).length > 0 ? (
                Object.keys(studentList)
                  .sort((a, b) => studentList[a].last_name.localeCompare(studentList[b].last_name))
                  .map(National_ID => (
                    <Grid item xs={12} key={National_ID}>
                      <PaperStyled elevation={3}>
                        <ButtonStyled onClick={() => gotoplanning(studentList[National_ID].id)}>
                          <IconStyled />
                          {studentList[National_ID].first_name} {studentList[National_ID].last_name} (ID: {studentList[National_ID].National_ID})
                        </ButtonStyled>
                      </PaperStyled>
                    </Grid>
                  ))
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
