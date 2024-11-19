import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
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

const AddClass = () => {
  const { schoolId } = useParams();
  const [classes, setClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [newClassData, setNewClassData] = useState({
    Topic: "",
    National_ID: "",
    Session1Day: "",
    Session1Time: "",
    Session2Day: "",
    Session2Time: "",
  });

  
  const fetchClasses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/classes/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
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
        const newClass = await response.json();
        setClasses((prevClasses) => [...prevClasses, newClass]);
        Swal.fire("Success", "Class added successfully", "success");
        setNewClassData({
          Topic: "",
          National_ID: "",
          Session1Day: "",
          Session1Time: "",
          Session2Day: "",
          Session2Time: "",
        });
      } else {
        Swal.fire("Error", "Failed to add class", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while adding class", "error");
    }
  };

  const handleOpenDialog = (cls) => {
    setCurrentClass(cls);
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
  
      const response = await fetch(
        `http://127.0.0.1:8000/api/edit_class/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(classData), 
        }
      );
  
      console.log(classData); 
  
      if (response.ok) {
        Swal.fire("Success", "Class updated successfully", "success");
        setOpenDialog(false);
        fetchClasses();
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
        setClasses((prevClasses) =>
          prevClasses.filter((cls) => cls.id !== currentClass.id)
        );
        setOpenDialog(false);
      } else {
        Swal.fire("Error", "Failed to delete class", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while deleting class", "error");
    }
  };
  

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Manage Classes
      </Typography>

      {/* Add Class Form */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddClass();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <TextField
          label="Class Topic"
          value={newClassData.Topic}
          onChange={(e) =>
            setNewClassData({ ...newClassData, Topic: e.target.value })
          }
          required
        />
        <TextField
          label="National ID"
          value={newClassData.National_ID}
          onChange={(e) =>
            setNewClassData({ ...newClassData, National_ID: e.target.value })
          }
          required
        />
        <FormControl required>
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
        <FormControl required>
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
        <FormControl>
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
        <FormControl>
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
        <Button variant="contained" type="submit">
          Add Class
        </Button>
      </Box>

      {/* Class List */}
      <Grid container spacing={3}>
  {classes.map((cls) => (
    <Grid item xs={12} md={6} key={cls.id}>
      <Card sx={{ position: "relative", padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {cls.Topic}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {cls.Session1Day} ({cls.Session1Time})
          </Typography>
          {cls.Session2Day && (
            <Typography variant="body2" color="textSecondary">
              {cls.Session2Day} ({cls.Session2Time})
            </Typography>
          )}
        </CardContent>

        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
            borderTop: "1px solid #ddd",
            pt: 2,
          }}
        >
          <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleOpenDialog(cls)}
                sx={{
                    alignSelf: "stretch", 
                    padding: "6px 8px", 
                    fontSize: "0.75rem", 
                    lineHeight: "1.2", 
                    minWidth: "auto", 
                    whiteSpace: "nowrap", 
                    textTransform: "none", 
                }}
                >
                Edit/Delete
        </Button>

          <Link
            to={`/dashboard/school/${schoolId}/classes/manage_students/${cls.id}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Button
              size="small"
              variant="contained"
              color="secondary"
              sx={{
                padding: "6px 16px",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                
                width: "90%",
                textTransform: "none", 
              }}
            >
              Manage Students
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>



      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
              <TextField
                fullWidth
                label="National ID"
                value={currentClass.National_ID}
                onChange={(e) =>
                  setCurrentClass({
                    ...currentClass,
                    National_ID: e.target.value,
                  })
                }
                margin="dense"
              />
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
                  value={currentClass.Session2Day}
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
                  value={currentClass.Session2Time}
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
    </Box>
  );
};

export default AddClass;
