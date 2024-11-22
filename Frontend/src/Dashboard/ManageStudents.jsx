import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, List, ListItem, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";

const ManageStudents = () => {
  const { schoolId, clsId } = useParams();
  const [students, setStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/class_student/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: clsId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data); // Set empty array or data
      } else {
        Swal.fire("Error", "Failed to fetch students", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while fetching students", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [clsId]);

  // Add student to class
  const handleAddStudent = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/add_class_student/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            Classes: clsId,
            Student: newStudentId,
          }),
        }
      );

      if (response.ok) {
        Swal.fire("Success", "Student added successfully", "success");
        fetchStudents();
        setNewStudentId("");
      } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.detail || "Failed to add student", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while adding student", "error");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/delete_class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id : clsId ,
            Student: studentId,
          }),
        }
      );

      if (response.ok) {
        Swal.fire("Success", "Student removed successfully", "success");
        fetchStudents();
      } else {
        Swal.fire("Error", "Failed to remove student", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while removing student", "error");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Manage Students for Class {clsId}
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
        <Typography color="textSecondary">No students in this class.</Typography>
      )}
    </Box>
  );
};

export default ManageStudents;
