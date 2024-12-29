import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Avatar, Autocomplete, IconButton, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // آیکون برگشت را اضافه کنید

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

const Container = styled(Box)(({ theme }) => ({

  alignItems: 'center',
  position: { xs: "relative", sm: "absolute" },
  top: 0,
  left: { xs: "10px", sm: "240px" },
  right: { xs: "20px", sm: "20px" },
  // width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
  maxWidth: { xs: "100%", sm: "1600px" },
  margin: "0 auto",
  // minHeight: "100vh",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflow: "hidden", 
  
}));




const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 'bold',
}));

const Discipline = ({ onBack }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [cases, setCases] = useState([]);
  const [students, setStudents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [editGrade, setEditGrade] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/case-list/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCases(data);
        } else {
          console.error('Failed to fetch cases');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/school-students/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchScores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/score-list/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setScores(data);
        } else {
          console.error('Failed to fetch scores');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCases();
    fetchStudents();
    fetchScores();
  }, []);

  const handleAddCase = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/case-add/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          National_ID: nationalId,
          Case: caseDescription,
        }),
      });

      if (response.ok) {
        console.log('Case added successfully');
        const updatedCases = await response.json();
        setCases([...cases, updatedCases]);
        setOpen(false);
        setNationalId('');
        setCaseDescription('');
      } else {
        console.error('Failed to add case');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteCase = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/case-delete/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log('Case deleted successfully');
        setCases(cases.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete case');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditScore = (student) => {
    setEditStudent(student);
    setEditGrade(student.Grade);
    setOpenEdit(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/score-change/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          National_ID: editStudent.National_ID,
          Grade: editGrade,
        }),
      });

      if (response.ok) {
        console.log('Score updated successfully');
        const updatedScore = await response.json();
        setScores(scores.map((item) => (item.National_ID === updatedScore.National_ID ? updatedScore : item)));
        setOpenEdit(false);
        setEditStudent(null);
        setEditGrade('');
      } else {
        console.error('Failed to update score');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredCases = cases.filter((item) => 
    item.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>

      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  width="100%"
  maxWidth="600px"
>
  <Button
    variant="contained"
    onClick={onBack}
    startIcon={<ArrowBackIcon />}
    style={{ marginRight: '16px' }}
  >
    Back
  </Button>
  <Typography variant="h4" gutterBottom>
    Disciplinary Management
  </Typography>
</Box>


        <StyledTabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            variant="scrollable" // اضافه کردن قابلیت اسکرول
            scrollButtons="auto" // نمایش دکمه‌های اسکرول به صورت خودکار
          >
            <Tab label="Manage Cases" />
            <Tab label="Disciplinary Scores" />
      </StyledTabs>

        {tabIndex === 0 && (
          <>
            <Section>
              <Typography variant="h6" gutterBottom>
                Add a New Disciplinary Case
              </Typography>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleAddCase}
              >
                Add Case
              </StyledButton>
            </Section>

            <Section>
              <TextField
                fullWidth
                margin="dense"
                label="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Typography variant="h6" gutterBottom>
                Existing Cases
              </Typography>
              <List>
                {filteredCases.map((item, index) => (
                  <ListItem key={index} alignItems="flex-start" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                    <Avatar style={{ marginRight: '15px', backgroundColor: '#6200ea' }}>
                      {item.first_name ? item.first_name.charAt(0) : '?'}
                    </Avatar>
                    <ListItemText
                      primary={`${item.first_name || ''} ${item.last_name || ''}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            National ID: {item.National_ID}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Case: {item.Case}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCase(item.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Section>
          </>
        )}

        {tabIndex === 1 && (
          <Section>
            <Typography variant="h6" gutterBottom>
              Disciplinary Scores
            </Typography>
            <List>
              {scores.map((student, index) => (
                <ListItem key={index} alignItems="flex-start" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                  <Avatar style={{ marginRight: '15px', backgroundColor: '#6200ea' }}>
                    {student.first_name.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={`${student.first_name} ${student.last_name}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          National ID: {student.National_ID}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Grade: {student.Grade}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditScore(student)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Section>
        )}

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add New Case</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={students}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.National_ID})`}
              renderInput={(params) => <TextField {...params} label="Select Student" margin="dense" />}
              onChange={(event, value) => setNationalId(value ? value.National_ID : '')}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Case Description"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Score</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Grade"
              type="number"
              value={editGrade}
              onChange={(e) => setEditGrade(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Discipline;
