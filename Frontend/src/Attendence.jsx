import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, FormControlLabel, Switch,Checkbox,
  Button, TextField, Card, CardContent
} from '@mui/material';
import Swal from "sweetalert2";
import { styled } from '@mui/system';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchAttendance = async (selectedDate) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/teacher/watch-attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Date: selectedDate.toISOString().split('T')[0] }), // Sending date
      });

      if (response.ok) {
        const attendanceData = await response.json();
        console.log("Fetched attendance data:", attendanceData);
        const newAttendance = {};

        // Map students to their attendance status and use the server-provided string value
        attendanceData.forEach(student => {
          newAttendance[student.National_ID] = {
            Absent: student.Absent === "True" ? "True" : "False", // Use the string value as provided by the server
            first_name: student.first_name,
            last_name: student.last_name,
          };
        });

        console.log("Processed attendance data:", newAttendance);
        setAttendance(newAttendance);
        // Update checkAll state based on if all students are absent or not
        const allAbsent = Object.values(newAttendance).every(student => student.Absent === "True");
        setCheckAll(allAbsent);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleAttendanceChange = (National_ID, status) => {
    console.log(`Changing attendance for ${National_ID} to ${status}`);
    setAttendance({
      ...attendance,
      [National_ID]: {
        ...attendance[National_ID],
        Absent: status ? "True" : "False", // Use string values for status
      },
    });
  };

  const handleCheckAllChange = (event) => {
    const checked = event.target.checked;
    console.log("Check all changed to:", checked);
    setCheckAll(checked);
    const newAttendance = {};
    Object.keys(attendance).forEach(National_ID => {
      newAttendance[National_ID] = {
        ...attendance[National_ID],
        Absent: checked ? "True" : "False", // Use string values for status
      };
    });
    setAttendance(newAttendance);
  };

  const handleDateChange = (newDate) => {
    console.log("Date changed to:", newDate);
    setDate(newDate);
    fetchAttendance(newDate);
  };

  const handleSubmit = async () => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      for (const National_ID in attendance) {
        const response = await fetch(`http://127.0.0.1:8000/teacher/check-student-attendance/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            Date: dateStr,
            National_ID: National_ID,
            Absent: attendance[National_ID].Absent,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update attendance for ${National_ID}`);
        }
      }
      Swal.fire('Success', 'Attendance updated successfully', 'success');
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ContainerStyled>
        <Card>
          <CardContent>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={handleDateChange}
              maxDate={new Date()} // Limit the date picker to prevent future dates
              renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
            />
            <Grid container alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkAll}
                      onChange={handleCheckAllChange}
                    />
                  }
                  label="Check All"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              {Object.keys(attendance).length > 0 ? (
                Object.keys(attendance)
                  .sort((a, b) => attendance[a].last_name.localeCompare(attendance[b].last_name)) // Sort by last name
                  .map(National_ID => (
                    <Grid item xs={12} key={National_ID}>
                      <PaperStyled elevation={3}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Typography>{attendance[National_ID].first_name} {attendance[National_ID].last_name} (ID: {National_ID}) {attendance[National_ID].Absent}</Typography>
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={attendance[National_ID]?.Absent === "True"} // Use string values for comparison
                                  onChange={(e) => handleAttendanceChange(National_ID, e.target.checked)}
                                />
                              }
                              label=""
                            />
                          </Grid>
                        </Grid>
                      </PaperStyled>
                    </Grid>
                  ))
              ) : (
                <Typography>No students in this class</Typography>
              )}
            </Grid>
            <ButtonStyled variant="contained" color="primary" onClick={handleSubmit}>
              Submit Attendance
            </ButtonStyled>
          </CardContent>
        </Card>
      </ContainerStyled>
    </LocalizationProvider>
  );
};

export default Attendance;
