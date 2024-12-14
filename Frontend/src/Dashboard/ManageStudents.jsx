import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, Button, TextField, Dialog } from "@mui/material";
import Swal from "sweetalert2";

const ManageStudents = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");
  
  // States for the custom message Dialog
  const [message, setMessage] = useState(null); // Message text
  const [messageType, setMessageType] = useState("success"); // Message type (success or error)
  const [messageOpen, setMessageOpen] = useState(false); // Open state for the Dialog

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: classId }), // Sending class ID
        }
      );

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

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setMessageOpen(true);
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/add_class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            Classes: classId, // Class ID
            Student: newStudentId, // Student ID
          }),
        }
      );

      if (response.ok) {
        showMessage("success", "Student added successfully");
        fetchStudents();
        setNewStudentId("");
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
        `http://127.0.0.1:8000/api/delete_class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: classId, // Class ID
            Student: studentId, // Student ID
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
  }, [classId]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Manage Students for Class {classId}
      </Typography>
      
      {/* Add Student Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Student ID"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddStudent}>
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                {student.first_name} {student.last_name} (ID: {student.id})
              </Typography>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleRemoveStudent(student.National_ID)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary">
          No students in this class.
        </Typography>
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
