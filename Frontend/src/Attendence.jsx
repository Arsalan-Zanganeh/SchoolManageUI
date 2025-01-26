import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, FormControlLabel, Switch, Checkbox,
  Button, TextField, Avatar, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import Swal from "sweetalert2";
import { styled } from '@mui/system';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useMediaQuery, useTheme } from '@mui/material';

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

const DialogStyled = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    maxWidth: '800px', // حداکثر عرض مودال
    minWidth: '600px', // حداقل عرض مودال
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%', // برای صفحات کوچک‌تر
      minWidth: '90%', // برای صفحات کوچک‌تر
    },
  },
}));

const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [images, setImages] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected student data

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // برای بررسی صفحه‌های موبایل

  const fetchAttendance = async (selectedDate) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/teacher/watch-attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Date: selectedDate.toISOString().split('T')[0] }),
      });

      if (response.ok) {
        const attendanceData = await response.json();
        const newAttendance = {};
        const imagesMap = {};

        // برای هر دانش‌آموز، تصویرش رو هم بگیر
        await Promise.all(attendanceData.map(async (student) => {
          const imageResponse = await fetch(
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
          const imageData = imageResponse.ok ? await imageResponse.json() : { profile_image: null };
          imagesMap[student.National_ID] = imageData.profile_image;

          // اضافه کردن وضعیت حضور و غیاب
          newAttendance[student.National_ID] = {
            Absent: student.Absent === "True" ? "True" : "False",
            first_name: student.first_name,
            last_name: student.last_name,
            National_ID: student.National_ID
          };
        }));

        setAttendance(newAttendance);
        setImages(imagesMap);

        const allAbsent = Object.values(newAttendance).every(student => student.Absent === "True");
        setCheckAll(allAbsent);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleAttendanceChange = (National_ID, status) => {
    setAttendance({
      ...attendance,
      [National_ID]: {
        ...attendance[National_ID],
        Absent: status ? "True" : "False",
      },
    });
  };

  const handleCheckAllChange = (event) => {
    const checked = event.target.checked;
    setCheckAll(checked);
    const newAttendance = {};
    Object.keys(attendance).forEach(National_ID => {
      newAttendance[National_ID] = {
        ...attendance[National_ID],
        Absent: checked ? "True" : "False",
      };
    });
    setAttendance(newAttendance);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchAttendance(newDate);
  };

  const handleSubmit = async () => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      for (const National_ID in attendance) {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/teacher/check-student-attendance/`, {
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

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
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
                  .sort((a, b) => attendance[a].last_name.localeCompare(attendance[b].last_name))
                  .map(National_ID => (
                    <Grid item xs={12} key={National_ID}>
                     <PaperStyled
  elevation={3}
  // با کلیک روی خود ردیف، پنجره پروفایل باز شود
  onClick={() => handleOpenModal(attendance[National_ID])}
>
  <Grid container justifyContent="space-between" alignItems="center">
    
    {/* بخش سمت چپ: آواتار + نام دانش‌آموز */}
    <Grid item xs={8} container alignItems="center">
      <Avatar
        src={images[National_ID] ? `http://127.0.0.1:8000/api${images[National_ID]}` : "/default-avatar.png"}
        alt="Student Photo"
        sx={{ width: isMobile ? 30 : 40, height: isMobile ? 30 : 40, marginRight: 2 }}
      />
      <Typography variant={isMobile ? "body2" : "body1"}>
        {attendance[National_ID].first_name} {attendance[National_ID].last_name} (ID: {National_ID})
      </Typography>
    </Grid>

    {/* بخش راست: چک‌باکس */}
    <Grid
      item
      // جلوگیری از باز شدن مودال در صورت کلیک روی چک‌باکس
      onClick={(e) => e.stopPropagation()}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={attendance[National_ID]?.Absent === "True"}
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

        {/* Modal to show student details */}
        {selectedStudent && (
          <DialogStyled open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} container justifyContent="center">
                  <Avatar
                    src={images[selectedStudent.National_ID] ? `http://127.0.0.1:8000/api${images[selectedStudent.National_ID]}` : "/default-avatar.png"}
                    alt="Student Photo"
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
                <Grid item xs={12} container direction="column" alignItems="center">
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>First Name: {selectedStudent.first_name}</Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>Last Name: {selectedStudent.last_name}</Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>National ID: {selectedStudent.National_ID}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </DialogStyled>
        )}
      </ContainerStyled>
    </LocalizationProvider>
  );
};

export default Attendance;
