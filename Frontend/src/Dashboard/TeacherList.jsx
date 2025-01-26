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

const TeacherList = ({ onBack }) => {
  const [teachers, setTeachers] = useState([]);
  const [images, setImages] = useState({}); // ذخیره تصاویر معلمان
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/school-teachers/`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // واکشی تصاویر معلمان
          const imagesMap = {};
          await Promise.all(
            data.map(async (teacher) => {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/portfolio/TeacherPicture_PrincipalSideView/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ National_ID: teacher.National_ID }),
                }
              );

              const imageData = imageResponse.ok
                ? await imageResponse.json()
                : { profile_image: null };
              imagesMap[teacher.National_ID] = imageData.profile_image;
            })
          );

          setTeachers(
            data.map((teacher) => ({
              id: teacher.id,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              national_id: teacher.National_ID,
              phone: teacher.Phone_Number,
              address: teacher.Address,
              email: teacher.Email,
            }))
          );

          setImages(imagesMap); // ذخیره تصاویر در استیت
        } else {
          console.error("Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleRowClick = (params) => {
    setSelectedTeacher(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeacher(null);
  };

  const columns = [
    {
      field: "profile_image",
      headerName: "Photo",
      width: isMobile ? 80 : 100,
      renderCell: (params) => (
        <Avatar
          src={
            images[params.row.national_id]
              ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${images[params.row.national_id]}`
              : "/default-avatar.png"
          }
          alt="Teacher Photo"
          sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
        />
      ),
    },
    { field: "id", headerName: "ID", width: isMobile ? 50 : 70 },
    { field: "first_name", headerName: "First Name", width: isMobile ? 100 : 150 },
    { field: "last_name", headerName: "Last Name", width: isMobile ? 100 : 150 },
    { field: "national_id", headerName: "National ID", width: isMobile ? 100 : 150 },
    { field: "phone", headerName: "Phone Number", width: isMobile ? 100 : 150 },
    { field: "address", headerName: "Address", width: isMobile ? 150 : 200 },
    { field: "email", headerName: "Email", width: isMobile ? 150 : 200 },
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Paper sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Teacher List
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={teachers}
            columns={columns}
            pageSize={5}
            loading={loading}
            disableSelectionOnClick
            onRowClick={handleRowClick}
          />
        </Box>
      </Paper>

      {/* Dialog for Teacher Details */}
      {selectedTeacher && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {`${selectedTeacher.first_name} ${selectedTeacher.last_name}`}
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
                  images[selectedTeacher.national_id]
                    ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${images[selectedTeacher.national_id]}`
                    : "/default-avatar.png"
                }
                alt="Teacher Photo"
                sx={{ width: 100, height: 100 }}
              />
              <Typography>
                <strong>National ID:</strong> {selectedTeacher.national_id}
              </Typography>
              <Typography>
                <strong>Phone Number:</strong> {selectedTeacher.phone}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedTeacher.address}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedTeacher.email}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default TeacherList;
