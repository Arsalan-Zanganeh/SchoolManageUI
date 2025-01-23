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
  const [filteredStudents, setFilteredStudents] = useState([]); // لیست فیلتر شده دانش‌آموزان
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null); // پایه انتخاب‌شده
  const [message, setMessage] = useState(null); // متن پیام
  const [messageType, setMessageType] = useState("success"); // نوع پیام (موفق یا خطا)
  const [messageOpen, setMessageOpen] = useState(false); // وضعیت باز بودن دیالوگ

  // دریافت لیست دانش‌آموزان کلاس
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/class_student/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: classId }),
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

  // دریافت همه دانش‌آموزان موجود
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
        setFilteredStudents(data); // تنظیم دانش‌آموزان اولیه
      } else {
        console.error("Failed to fetch available students");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // نمایش پیام
  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setMessageOpen(true);
  };

  // افزودن دانش‌آموز به کلاس
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

  // حذف دانش‌آموز از کلاس
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

  // فیلتر دانش‌آموزان بر اساس پایه
// فیلتر دانش‌آموزان بر اساس پایه
useEffect(() => {
  if (selectedGrade) {
    setFilteredStudents(
      availableStudents.filter((student) => student.Grade_Level === selectedGrade)
    );
  } else {
    setFilteredStudents(availableStudents); // اگر پایه انتخاب نشد، همه دانش‌آموزان
  }
}, [selectedGrade, availableStudents]);


  useEffect(() => {
    fetchStudents();
    fetchAvailableStudents();
  }, [classId]);

  return (
    <Box sx={{ p: 2, mx: "auto", width: "100%" }}>
    <Typography variant="h5" textAlign="center" mb={3}>
      Manage Students for Class {classId}
    </Typography>
  
    {/* فیلتر بر اساس پایه */}
    <Box sx={{ mb: 3 }}>
      <Autocomplete
        options={[...new Set(availableStudents.map((s) => s.Grade_Level))]}
        getOptionLabel={(option) => `Grade ${option}`}
        value={selectedGrade}
        onChange={(event, value) => setSelectedGrade(value)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Grade" fullWidth />
        )}
        sx={{
          width: { xs: "100%", sm: "auto" }, // موبایل: تمام عرض، دسکتاپ: پیش‌فرض
        }}
      />
    </Box>
  
    {/* افزودن دانش‌آموز */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // موبایل: عمودی، دسکتاپ: افقی
        gap: 2,
        mb: 3,
        alignItems: "center",
      }}
    >
      <Autocomplete
        options={filteredStudents}
        getOptionLabel={(option) =>
          `${option.first_name} ${option.last_name} (ID: ${option.National_ID})`
        }
        value={selectedStudent}
        onChange={(event, value) => setSelectedStudent(value)}
        renderInput={(params) => (
          <TextField {...params} label="Select Student" fullWidth />
        )}
        sx={{
          flex: 1,
          width: { xs: "100%", sm: "auto" }, // موبایل: تمام عرض، دسکتاپ: پیش‌فرض
        }}
      />
      <Button
        variant="contained"
        onClick={handleAddStudent}
        sx={{
          width: { xs: "100%", sm: "auto" }, // موبایل: تمام عرض، دسکتاپ: خودکار
        }}
      >
        Add Student
      </Button>
    </Box>

      {/* لیست دانش‌آموزان */}
      <Typography variant="h6">Students in this Class:</Typography>
      {students.length > 0 ? (
        <List>
          {students.map((student) => (
            <ListItem
              key={student.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              <Typography>
                {student.first_name} {student.last_name} (ID: {student.National_ID})
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
    </Box>
  );
};

export default ManageStudents;
