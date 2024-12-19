import React, { useState, useCallback,useEffect } from 'react';
import {
  Container, Typography, TextField, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox
} from '@mui/material';
import Swal from "sweetalert2";
import { styled } from '@mui/system';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0),
}));


const AttendanceStatus = ({Topic}) => {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date());

  const fetchAttendance =  useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/student/parent-attendance/", {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const attendanceData = await response.json();
        console.log("Fetched attendance data:", attendanceData);
        const selectedMonthStr = month.toISOString().split('T')[0].slice(0, 7);
        console.log("Fetched attendance data:", selectedMonthStr);

        const filteredData = attendanceData.filter(entry =>
          entry.Date.startsWith(selectedMonthStr)
        );
        const filteredAttendance = filteredData.filter(
          (record) => record.Topic === Topic
        );
        filteredAttendance.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        setAttendance(filteredAttendance);
      } else {
        console.error('Failed to fetch class list');
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  });

  const handleMonthChange = (newMonth) => {
    console.log("Month changed to:", newMonth);
    setMonth(newMonth);
    fetchAttendance(newMonth);
  };

  useEffect(() => {
    fetchAttendance(month);
  },[month]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ContainerStyled>
        <Card>
          <CardContent>
            <DatePicker
              views={['year', 'month']}
              label="Select Month"
              value={month}
              onChange={handleMonthChange}
              maxDate={new Date()} // Limit the date picker to prevent future months
              renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellStyled>Date</TableCellStyled>
                    <TableCellStyled>Absent</TableCellStyled>
                    <TableCellStyled>Present</TableCellStyled>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.length > 0 ? (
                    attendance.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCellStyled>{entry.Date}</TableCellStyled>
                        <TableCellStyled>
                          <Checkbox
                            checked={entry.Absent === "True"}
                            disabled
                          />
                        </TableCellStyled>
                        <TableCellStyled>
                          <Checkbox
                            checked={entry.Absent === "False"}
                            disabled
                          />
                        </TableCellStyled>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCellStyled colSpan={3}>
                        <Typography>No attendance records for this month</Typography>
                      </TableCellStyled>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </ContainerStyled>
    </LocalizationProvider>
  );
};

export default AttendanceStatus;
