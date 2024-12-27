import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ManageStudents from "../ManageStudents";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";

const AddClass = ({ goBack }) => {
  const { schoolId } = useParams();
  const [classes, setClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [openManageDialog, setOpenManageDialog] = useState(false); // مدیریت باز و بسته شدن پنجره
const [selectedClassId, setSelectedClassId] = useState(null); // ذخیره ID کلاس انتخاب شده


const handleOpenManageDialog = (classId) => {
  setSelectedClassId(classId); // ذخیره ID کلاس انتخاب شده
  setOpenManageDialog(true); // باز کردن پنجره
};

const handleCloseManageDialog = () => {
  setSelectedClassId(null); // خالی کردن ID کلاس
  setOpenManageDialog(false); // بستن پنجره
};


  const [newClassData, setNewClassData] = useState({
    Topic: "",
    National_ID: "",
    Session1Day: "",
    Session1Time: "",
    Session2Day: "",
    Session2Time: "",
  });

  const fetchTeacherInfo = async (teacherId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/othersides-watch-teacher-info/", {
        method: "POST",
        credentials: 'include',

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: teacherId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCurrentTeacher(data); // ذخیره اطلاعات معلم
      } else {
        console.error("Failed to fetch teacher info");
      }
    } catch (error) {
      console.error("Error fetching teacher info:", error);
    }
  };
  
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/school-teachers/", {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTeachers(data); // ذخیره اطلاعات معلمان
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);
  const [teachers, setTeachers] = useState([]); // ذخیره اطلاعات معلمان



  const [backgroundPatternIndex, setBackgroundPatternIndex] = useState(0);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/classes/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const sortedData = data.sort((a, b) => a.id - b.id); // مرتب‌سازی براساس id
        setClasses(data);
      } else {
        Swal.fire("Error", "Failed to fetch classes", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while fetching classes", "error");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [schoolId]);

  const handleAddClass = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/add_class/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newClassData),
      });
  
      if (response.ok) {
        Swal.fire("Success", "Class added successfully", "success");
        fetchClasses(); // مجدداً کلاس‌ها را از سرور بگیر
        setNewClassData({
          Topic: "",
          National_ID: "",
          Session1Day: "",
          Session1Time: "",
          Session2Day: "",
          Session2Time: "",
        });
        handleCloseAddDialog();
      } else {
        Swal.fire("Error", "Failed to add class", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while adding class", "error");
    }
  };
  

  const handleOpenDialog = async (cls) => {
    setCurrentClass({
      ...cls, // اطلاعات کلاس
      National_ID: null, // به‌صورت پیش‌فرض خالی
    });
  
    // گرفتن اطلاعات معلم بر اساس Teacher ID
    if (cls.Teacher) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/othersides-watch-teacher-info/",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: cls.Teacher }),
          }
        );
  
        if (response.ok) {
          const teacherData = await response.json();
  
          // اضافه کردن کد ملی معلم به currentClass
          setCurrentClass((prev) => ({
            ...prev,
            National_ID: teacherData.National_ID, // اضافه کردن کد ملی
          }));
        } else {
          console.error("Failed to fetch teacher info");
        }
      } catch (error) {
        console.error("Error fetching teacher info:", error);
      }
    }
  
    setOpenDialog(true);
  };
  
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentClass(null);
  };

  const handleSaveEdit = async () => {
    try {
      const classData = {
        id: currentClass.id,
        Topic: currentClass.Topic,
        Teacher: currentClass.National_ID,
        Session1Day: currentClass.Session1Day,
        Session1Time: currentClass.Session1Time,
        Session2Day: currentClass.Session2Day || null,
        Session2Time: currentClass.Session2Time || null,
      };
  
      const response = await fetch(`http://127.0.0.1:8000/api/edit_class/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(classData),
      });
  
      if (response.ok) {
        Swal.fire("Success", "Class updated successfully", "success");
        fetchClasses(); // بعد از ویرایش، مجدداً کلاس‌ها را از سرور بگیر
        setOpenDialog(false);
      } else {
        Swal.fire("Error", "Failed to update class", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while updating class", "error");
    }
  };
  
  
  const handleDeleteClass = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_class/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: currentClass.id }),
      });
  
      if (response.ok) {
        Swal.fire("Success", "Class deleted successfully", "success");
        fetchClasses(); // بعد از حذف، مجدداً کلاس‌ها را از سرور بگیر
        setOpenDialog(false);
      } else {
        Swal.fire("Error", "Failed to delete class", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while deleting class", "error");
    }
  };
  
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  const patterns = [
    {
      background: `linear-gradient(135deg, #f9f9f9 25%, transparent 25%),
                  linear-gradient(225deg, #f9f9f9 25%, transparent 25%)`,
      backgroundSize: "50px 50px",
      backgroundColor: "#f0f0f0",
    },
    {
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 25%, transparent 25%) -20px 0,
                  linear-gradient(225deg, rgba(255, 255, 255, 0.9) 25%, transparent 25%) -20px 0,
                  linear-gradient(45deg, rgba(240, 240, 240, 0.9) 25%, transparent 25%),
                  linear-gradient(315deg, rgba(240, 240, 240, 0.9) 25%, transparent 25%)`,
      backgroundSize: "50px 50px",
      backgroundColor: "#fafafa",
    },
    {
      background: `radial-gradient(circle at 10px 10px, #e0e0e0 2px, transparent 2px)`,
      backgroundSize: "30px 30px",
      backgroundColor: "#ffffff",
    },
    {
      background: `linear-gradient(to right, #e0f7fa, #e0f7fa 10px, transparent 10px, transparent 20px),
                  linear-gradient(to bottom, #e0f7fa, #e0f7fa 10px, transparent 10px, transparent 20px)`,
      backgroundSize: "20px 20px",
      backgroundColor: "#b2ebf2",
    },
    {
      background: `conic-gradient(from 0deg at 50% 50%, #c8e6c9, #ffffff 25%, #c8e6c9 50%, #ffffff 75%, #c8e6c9)`,
      backgroundSize: "60px 60px",
      backgroundColor: "#f1f8e9",
    },
    {
      background: `repeating-linear-gradient(45deg, #ffcdd2, #ffcdd2 10px, #f8bbd0 10px, #f8bbd0 20px)`,
      backgroundSize: "50px 50px",
      backgroundColor: "#fce4ec",
    },
  ];
  
  

  // Assign a pattern to each class
  const getBackgroundForClass = (index) => {
    return patterns[index % patterns.length];
  };

  
  return (
    <Box
      sx={{
        position: { xs: "relative", sm: "absolute" },
        left: { xs: "-4px", sm: "190px" },
        right: { xs: "10px", sm: "60px" },
  
        maxWidth: { xs: "100%", sm: "1400px" },
        height: { xs: "auto", sm: "auto" },
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
<Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // در موبایل زیر هم و در دسکتاپ کنار هم
    justifyContent: { xs: "center", sm: "space-between" }, // وسط در موبایل و فاصله در دسکتاپ
    alignItems: "center",
    position: "relative",
    width: "100%",
    mb: 4,
    gap: { xs: 2, sm: 0 }, // فاصله مناسب برای حالت موبایل
  }}
>
  <Button
    variant="contained"
    color="secondary"
    onClick={goBack}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      backgroundColor: "#6A1B9A",
      ":hover": {
        backgroundColor: "#4A0072",
      },
      alignSelf: { xs: "center", sm: "flex-start" }, // مرکز در موبایل
      position: { sm: "absolute" }, // فقط در دسکتاپ ثابت به چپ
      left: { sm: 0 },
    }}
  >
    Back
    <ArrowBackIcon />
  </Button>

  <Typography
    variant="h4"
    textAlign="center"
    sx={{
      flex: 1,
      textAlign: "center",
      marginLeft: { sm: "auto" }, // برای قرارگیری در مرکز در دسکتاپ
      marginRight: { sm: "auto" },
    }}
  >
    Manage Classes
  </Typography>
</Box>





      <Button
        variant="contained"
        onClick={handleOpenAddDialog}
        sx={{
          alignSelf: "stretch",
          mb: 4,
          padding: "12px",
          fontSize: "1rem",
          textTransform: "none",
          width: "100%",
          backgroundColor: "#007BFF",
          color: "#fff",
          borderRadius: "6px",
          transition: "none", // حذف تمام انیمیشن‌ها
          ":hover": {
            backgroundColor: "#007BFF", // بدون تغییر در رنگ هنگام هاور
            boxShadow: "none", // حذف هرگونه سایه در هاور
          },
          ":active": {
            backgroundColor: "#007BFF", // رنگ ثابت هنگام کلیک
            boxShadow: "none", // حذف هرگونه تغییر در کلیک
          },
        }}
        
        
        
      >
        Add Class
      </Button>

      {/* Add Class Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
      <DialogTitle>Add Class</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddClass();
            handleCloseAddDialog();
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", marginTop: 2 }}
        >
          <TextField
            label="Class Topic"
            value={newClassData.Topic}
            onChange={(e) =>
              setNewClassData({ ...newClassData, Topic: e.target.value })
            }
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>Teacher</InputLabel>
            <Select
              value={newClassData.National_ID}
              onChange={(e) => {
                setNewClassData({ ...newClassData, National_ID: e.target.value });
              }}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.National_ID}>
                  {`${teacher.first_name} ${teacher.last_name} (${teacher.National_ID})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Session 1 Day</InputLabel>
            <Select
              value={newClassData.Session1Day}
              onChange={(e) =>
                setNewClassData({ ...newClassData, Session1Day: e.target.value })
              }
            >
              <MenuItem value="saturday">Saturday</MenuItem>
              <MenuItem value="sunday">Sunday</MenuItem>
              <MenuItem value="monday">Monday</MenuItem>
              <MenuItem value="tuesday">Tuesday</MenuItem>
              <MenuItem value="wednesday">Wednesday</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Session 1 Time</InputLabel>
            <Select
              value={newClassData.Session1Time}
              onChange={(e) =>
                setNewClassData({ ...newClassData, Session1Time: e.target.value })
              }
            >
              <MenuItem value="8:00 to 9:00">8:00 to 9:00</MenuItem>
              <MenuItem value="9:15 to 10:15">9:15 to 10:15</MenuItem>
              <MenuItem value="10:30 to 11:30">10:30 to 11:30</MenuItem>
              <MenuItem value="11:45 to 12:45">11:45 to 12:45</MenuItem>
              <MenuItem value="13:00 to 14:00">13:00 to 14:00</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Session 2 Day (Optional)</InputLabel>
            <Select
              value={newClassData.Session2Day}
              onChange={(e) =>
                setNewClassData({ ...newClassData, Session2Day: e.target.value })
              }
            >
              <MenuItem value="saturday">Saturday</MenuItem>
              <MenuItem value="sunday">Sunday</MenuItem>
              <MenuItem value="monday">Monday</MenuItem>
              <MenuItem value="tuesday">Tuesday</MenuItem>
              <MenuItem value="wednesday">Wednesday</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Session 2 Time (Optional)</InputLabel>
            <Select
              value={newClassData.Session2Time}
              onChange={(e) =>
                setNewClassData({ ...newClassData, Session2Time: e.target.value })
              }
            >
              <MenuItem value="8:00 to 9:00">8:00 to 9:00</MenuItem>
              <MenuItem value="9:15 to 10:15">9:15 to 10:15</MenuItem>
              <MenuItem value="10:30 to 11:30">10:30 to 11:30</MenuItem>
              <MenuItem value="11:45 to 12:45">11:45 to 12:45</MenuItem>
              <MenuItem value="13:00 to 14:00">13:00 to 14:00</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "100%", marginTop: 3 }}
          >
            Add Class
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
      {/* Class List */}
      <Grid container spacing={3}>
  {classes.length ? (
    classes.map((cls, index) => (
      <Grid item xs={12} md={6} lg={4} key={cls.id}>
        <Card
          sx={{
            position: "relative",
            padding: 2,
            ...getBackgroundForClass(index),
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            color: "#333",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              {cls.Topic}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, color: "#000" }}>
              {cls.Session1Day} ({cls.Session1Time})
            </Typography>
            {cls.Session2Day && (
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, color: "#000" }}
              >
                {cls.Session2Day} ({cls.Session2Time})
              </Typography>
            )}
          </CardContent>
          <CardActions
  sx={{
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 16px",
  }}
>
  <Button
    size="small"
    variant="contained"
    color="primary"
    onClick={() => handleOpenDialog(cls)}
    sx={{
      height: "40px",
    }}
  >
    Edit/Delete
  </Button>

  <Button
    size="small"
    variant="contained"
    color="primary"
    onClick={() => handleOpenManageDialog(cls.id)}
    sx={{
      height: "40px",
    }}
  >
    Manage Students
  </Button>
</CardActions>

        </Card>
      </Grid>
    ))
  ) : (
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: "1.2rem",
          }}
        >
          No Classes are signed to this School.
        </Typography>
      </Box>
    </Grid>
  )}
</Grid>

       

      {/* Dialog for Edit/Delete */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          {currentClass && (
            <>
              <TextField
                fullWidth
                label="Class Topic"
                value={currentClass.Topic}
                onChange={(e) =>
                  setCurrentClass({ ...currentClass, Topic: e.target.value })
                }
                margin="dense"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={currentClass.Teacher || ""} // مقدار فعلی را نمایش می‌دهد
                  onChange={(e) => {
                    const selectedTeacher = teachers.find(
                      (teacher) => teacher.id === e.target.value
                    );
                    setCurrentClass({
                      ...currentClass,
                      Teacher: selectedTeacher.id, // بروزرسانی Teacher در currentClass
                      National_ID: selectedTeacher.National_ID // اضافه کردن کد ملی معلم
                    });
                    setCurrentTeacher(selectedTeacher); // به‌روزرسانی معلم فعلی
                  }}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {`${teacher.first_name} ${teacher.last_name} (${teacher.National_ID})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Session 1 Day</InputLabel>
                <Select
                  value={currentClass.Session1Day}
                  onChange={(e) =>
                    setCurrentClass({
                      ...currentClass,
                      Session1Day: e.target.value,
                    })
                  }
                >
                  <MenuItem value="saturday">Saturday</MenuItem>
                  <MenuItem value="sunday">Sunday</MenuItem>
                  <MenuItem value="monday">Monday</MenuItem>
                  <MenuItem value="tuesday">Tuesday</MenuItem>
                  <MenuItem value="wednesday">Wednesday</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Session 1 Time</InputLabel>
                <Select
                  value={currentClass.Session1Time}
                  onChange={(e) =>
                    setCurrentClass({
                      ...currentClass,
                      Session1Time: e.target.value,
                    })
                  }
                >
                  <MenuItem value="8:00 to 9:00">8:00 to 9:00</MenuItem>
                  <MenuItem value="9:15 to 10:15">9:15 to 10:15</MenuItem>
                  <MenuItem value="10:30 to 11:30">10:30 to 11:30</MenuItem>
                  <MenuItem value="11:45 to 12:45">11:45 to 12:45</MenuItem>
                  <MenuItem value="13:00 to 14:00">13:00 to 14:00</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Session 2 Day (Optional)</InputLabel>
                <Select
                  value={currentClass.Session2Day || ""}
                  onChange={(e) =>
                    setCurrentClass({
                      ...currentClass,
                      Session2Day: e.target.value,
                    })
                  }
                >
                  <MenuItem value="saturday">Saturday</MenuItem>
                  <MenuItem value="sunday">Sunday</MenuItem>
                  <MenuItem value="monday">Monday</MenuItem>
                  <MenuItem value="tuesday">Tuesday</MenuItem>
                  <MenuItem value="wednesday">Wednesday</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Session 2 Time (Optional)</InputLabel>
                <Select
                  value={currentClass.Session2Time || ""}
                  onChange={(e) =>
                    setCurrentClass({
                      ...currentClass,
                      Session2Time: e.target.value,
                    })
                  }
                >
                  <MenuItem value="8:00 to 9:00">8:00 to 9:00</MenuItem>
                  <MenuItem value="9:15 to 10:15">9:15 to 10:15</MenuItem>
                  <MenuItem value="10:30 to 11:30">10:30 to 11:30</MenuItem>
                  <MenuItem value="11:45 to 12:45">11:45 to 12:45</MenuItem>
                  <MenuItem value="13:00 to 14:00">13:00 to 14:00</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save Changes
          </Button>
          <Button onClick={handleDeleteClass} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={openManageDialog}
  onClose={handleCloseManageDialog}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>Manage Students</DialogTitle>
  <DialogContent>
    {selectedClassId && <ManageStudents classId={selectedClassId} />} 
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseManageDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>



    </Box>
  );
};

export default AddClass;

