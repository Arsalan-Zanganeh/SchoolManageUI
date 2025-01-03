import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  Button,
  Dialog,
  TextField,
  Autocomplete,
} from "@mui/material";

const ManageStudents = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState(null); // Message text
  const [messageType, setMessageType] = useState("success"); // Message type (success or error)
  const [messageOpen, setMessageOpen] = useState(false); // Open state for the Dialog

  // Fetch students in the class
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/class_student/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: classId }), // Sending class ID
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        showMessage("error", "Failed to fetch students");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Network error while fetching students");
    }
  };

  // Fetch all available students
  const fetchAvailableStudents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/school-students/`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableStudents(data);
      } else {
        console.error("Failed to fetch available students");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Show a message dialog
  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setMessageOpen(true);
  };

  // Add a student to the class
  const handleAddStudent = async () => {
    if (!selectedStudent) {
      showMessage("error", "Please select a student.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/add_class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            Classes: classId,
            Student: selectedStudent.National_ID,
          }),
        }
      );

      if (response.ok) {
        showMessage("success", "Student added successfully");
        fetchStudents();
        setSelectedStudent(null);
      } else {
        const errorData = await response.json();
        showMessage("error", errorData.detail || "Failed to add student");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Network error while adding student");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/delete_class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: classId,
            Student: studentId,
          }),
        }
      );

      if (response.ok) {
        showMessage("success", "Student removed successfully");
        fetchStudents();
      } else {
        showMessage("error", "Failed to remove student");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Network error while removing student");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAvailableStudents();
  }, [classId]);

  return (
    <Box sx={{ p: 2 }}>
    <Typography variant="h5" textAlign="center" mb={3}>
      Manage Students for Class {classId}
    </Typography>
  
    {/* Add Student Section */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // در موبایل ستونی شود
        gap: 2,
        mb: 3,
        alignItems: "center",
      }}
    >
      <Autocomplete
        options={availableStudents}
        getOptionLabel={(option) =>
          `${option.first_name} ${option.last_name} (ID: ${option.National_ID})`
        }
        value={selectedStudent}
        onChange={(event, value) => setSelectedStudent(value)}
        renderInput={(params) => (
          <TextField {...params} label="Select Student" fullWidth />
        )}
        sx={{ flex: 1, minWidth: { xs: "100%", sm: "auto" } }} // تمام عرض در موبایل
      />
      <Button
        variant="contained"
        onClick={handleAddStudent}
        sx={{
          width: { xs: "100%", sm: "auto" }, // تمام عرض در موبایل
        }}
      >
        Add Student
      </Button>
    </Box>
  
    {/* List of Students */}
    <Typography variant="h6">Students in this Class:</Typography>
    {students.length > 0 ? (
      <List>
        {students.map((student) => (
          <ListItem
            key={student.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // ستونی در موبایل
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1, // فاصله بین آیتم‌ها
              p: 1,
              border: "1px solid #e0e0e0", // حاشیه برای تفکیک آیتم‌ها
              borderRadius: "8px",
            }}
          >
            <Typography sx={{ textAlign: { xs: "center", sm: "left" } }}>
              {student.first_name} {student.last_name} (ID: {student.National_ID})
            </Typography>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleRemoveStudent(student.National_ID)}
              sx={{
                mt: { xs: 1, sm: 0 }, // فاصله در حالت موبایل
                width: { xs: "100%", sm: "auto" }, // دکمه تمام عرض در موبایل
              }}
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography color="textSecondary">No students in this class.</Typography>
    )}
  
    {/* Message Dialog */}
    <Dialog open={messageOpen} onClose={() => setMessageOpen(false)}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          color={messageType === "success" ? "green" : "red"}
        >
          {messageType === "success" ? "Success" : "Error"}
        </Typography>
        <Typography>{message}</Typography>
        <Button
          onClick={() => setMessageOpen(false)}
          variant="contained"
          sx={{ mt: 2 }}
        >
          OK
        </Button>
      </Box>
    </Dialog>
  </Box>
  
  );
};

export default ManageStudents;
