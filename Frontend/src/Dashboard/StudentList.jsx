import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StudentList = ({ onBack }) => {
  const [students, setStudents] = useState([]);
  const [images, setImages] = useState({}); // استیت برای ذخیره تصاویر
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/portfolio/student_files/`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // واکشی تصاویر و ذخیره در استیت
          const imagesMap = {};
          await Promise.all(
            data.map(async (student) => {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/portfolio/StudentPicture_TeacherSideView/`,
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
            })
          );

          setStudents(
            data.map((student) => ({
              id: student.id,
              first_name: student.first_name,
              last_name: student.last_name,
              national_id: student.National_ID,
              father_name: student.Father_first_name,
              father_phone: student.Father_Phone_Number,
              grade: student.Grade_Level,
              address: student.Address,
              email: student.Email,
            }))
          );

          setImages(imagesMap); // ذخیره تصاویر در استیت
        } else {
          console.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleRowClick = (params) => {
    setSelectedStudent(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const columns = [
    {
      field: "profile_image",
      headerName: "Photo",
      width: isMobile ? 80 : 100,
      renderCell: (params) => (
        <Avatar
          src={images[params.row.national_id] ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${images[params.row.national_id]}` : "/default-avatar.png"}
          alt="Student Photo"
          sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
        />
      ),
    },
    { field: "id", headerName: "ID", width: isMobile ? 50 : 70 },
    { field: "first_name", headerName: "First Name", width: isMobile ? 100 : 150 },
    { field: "last_name", headerName: "Last Name", width: isMobile ? 100 : 150 },
    { field: "national_id", headerName: "National ID", width: isMobile ? 100 : 150 },
    { field: "father_name", headerName: "Father's Name", width: isMobile ? 100 : 150 },
    { field: "father_phone", headerName: "Father's Phone", width: isMobile ? 100 : 150 },
    { field: "grade", headerName: "Grade", width: isMobile ? 80 : 100 },
    { field: "address", headerName: "Address", width: isMobile ? 150 : 200 },
    { field: "email", headerName: "Email", width: isMobile ? 150 : 200 },
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Paper sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Student List
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={students}
            columns={columns}
            pageSize={5}
            loading={loading}
            disableSelectionOnClick
            onRowClick={handleRowClick}
          />
        </Box>
      </Paper>

      {/* Dialog for Student Details */}
      {selectedStudent && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {`${selectedStudent.first_name} ${selectedStudent.last_name}`}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={
                  images[selectedStudent.national_id]
                    ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${images[selectedStudent.national_id]}`
                    : "/default-avatar.png"
                }
                alt="Student Photo"
                sx={{ width: 100, height: 100 }}
              />
              <Typography><strong>National ID:</strong> {selectedStudent.national_id}</Typography>
              <Typography><strong>Father's Name:</strong> {selectedStudent.father_name}</Typography>
              <Typography><strong>Father's Phone:</strong> {selectedStudent.father_phone}</Typography>
              <Typography><strong>Grade:</strong> {selectedStudent.grade}</Typography>
              <Typography><strong>Address:</strong> {selectedStudent.address}</Typography>
              <Typography><strong>Email:</strong> {selectedStudent.email}</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default StudentList;
