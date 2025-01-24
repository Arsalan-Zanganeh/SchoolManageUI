import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define custom theme for scrollbar and other global styles
const customTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        ::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `,
    },
  },
});

// API Endpoints
const QUESTIONS_API_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-quiz-questions/`;
const ADD_QUESTION_API_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-add-quiz-question/`;
const EDIT_QUESTION_API_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-edit-quiz-question/`;
const DELETE_QUESTION_API_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-delete-quiz-question/`;

const ManageQuestionsPage = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: '',
    Question: '',
    Answer: '',
    Zarib: 1,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch questions on component mount and whenever quizId changes
  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(QUESTIONS_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ QuizTeacherExplan: quizId }),
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error loading questions');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the dialog
  const handleDialogClose = () => setOpenDialog(false);

  // Handle opening the dialog for adding or editing
  const handleDialogOpen = (isAdd, question = null) => {
    setIsAdding(isAdd);
    if (isAdd) {
      setCurrentQuestion({
        id: '',
        Question: '',
        Answer: '',
        Zarib: 1,
      });
    } else if (question) {
      setCurrentQuestion({
        id: question.id,
        Question: question.Question,
        Answer: question.Answer,
        Zarib: question.Zarib,
      });
    }
    setOpenDialog(true);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new question
  const addQuestion = async () => {
    setLoading(true);
    try {
      // Prepare the payload
      const payload = {
        QuizTeacherExplan: quizId, // Pass the quiz ID
        Question: currentQuestion.Question, // The question text
        Answer: currentQuestion.Answer, // The answer
        Zarib: currentQuestion.Zarib, // The weight
      };

      const response = await fetch(ADD_QUESTION_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Option 1: Re-fetch the questions to ensure the list is up-to-date
        await fetchQuestions();

        // Option 2: If the server returns the new question, append it to the state
        // const newQuestion = await response.json();
        // setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

        // Show success notification
        setSnackbarMessage('Question added successfully');
        setSnackbarOpen(true);
        setOpenDialog(false);
      } else {
        // Handle server error
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to add question');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error adding question');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Edit an existing question
  const editQuestion = async () => {
    setLoading(true);
    try {
      // Prepare the payload
      const payload = {
        QuizTeacherExplan: quizId, // Ensure quizId is valid
        Question_ID: currentQuestion.id, // Map the ID correctly
        Question: currentQuestion.Question, // Map updated question text
        Answer: currentQuestion.Answer, // Map updated answer text
        Zarib: currentQuestion.Zarib, // Map updated weight
      };

      const response = await fetch(EDIT_QUESTION_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Option 1: Re-fetch the questions to ensure the list is up-to-date
        await fetchQuestions();

        // Option 2: Update the question list locally
        // const updatedQuestions = questions.map((q) =>
        //   q.id === currentQuestion.id ? { ...q, ...currentQuestion } : q
        // );
        // setQuestions(updatedQuestions);

        // Show success message
        setSnackbarMessage('Question updated successfully');
        setSnackbarOpen(true);
        setOpenDialog(false);
      } else {
        // Handle server error
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to update question');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error updating question');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Delete a question
// حذف یک سوال
const deleteQuestion = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(DELETE_QUESTION_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ QuizTeacherExplan: quizId, Question_ID: id }),
      });
      if (response.ok) {
        // درخواست جدید برای بارگذاری سوال‌ها
        await fetchQuestions();
  
        setSnackbarMessage('Question deleted successfully');
        setSnackbarOpen(true);
      } else {
        throw new Error('Failed to delete question');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error deleting question');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
            backgroundColor: '#DCE8FD' ,
            height : '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            //   bottom: 0, 
              justifyContent: 'center',
              // alignItems: 'center',
              padding: '20px',
            
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ p : 4 ,maxWidth: '100%', width: '100%' }}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              Manage Questions for Quiz {quizId}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              onClick={() => handleDialogOpen(true)}
              sx={{ borderRadius: 8, mt: 2, mb: 3 }}
            >
              Add New Question
            </Button>
            <Box
              sx={{
                maxHeight: '600px',
                overflowY: 'auto',
                pr: 2,
                pl: 2,
                py: 1,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <Grid item xs={12} key={question.id}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            mb: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              mb: 2,
                              wordWrap: 'break-word',
                            }}
                          >
                            {question.Question}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 1,
                              wordWrap: 'break-word',
                            }}
                          >
                            Answer: {question.Answer}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 1,
                              wordWrap: 'break-word',
                            }}
                          >
                            Weight: {question.Zarib}
                          </Typography>
                          <Box
  display="flex"
  justifyContent="flex-end"
  mt={2}
  sx={{
    flexWrap: 'wrap', // برای قرارگیری صحیح دکمه‌ها در حالت ریسپانسیو
    gap: 1, // برای ایجاد فاصله بین دکمه‌ها
  }}
>
  <Button
    variant="outlined"
    color="primary"
    startIcon={<Edit />}
    onClick={() => handleDialogOpen(false, question)}
    sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
  >
    Edit
  </Button>
  <IconButton color="error" onClick={() => deleteQuestion(question.id)}>
    <Delete />
  </IconButton>
</Box>

                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography variant="body1" color="textSecondary">
                          No questions found.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Paper>

          {/* Add/Edit Dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center' }}>
              {isAdding ? 'Add New Question' : 'Edit Question'}
            </DialogTitle>
            <DialogContent>
            <TextField
  label="Question"
  name="Question"
  value={currentQuestion.Question}
  onChange={handleInputChange}
  variant="outlined"
  multiline
  minRows={4}
  maxRows={10}
  fullWidth
  // افزایش فاصله پیش‌فرض
  margin="normal"
  // لیبل را به اجبار بالا ببریم و کمی فاصله به آن بدهیم
  InputLabelProps={{
    shrink: true,
    style: { marginTop: '8px' },  // فاصله‌دهی از بالا
  }}
  sx={{ mb: 2 }}
  inputProps={{
    style: { resize: 'vertical' },
  }}
/>


<TextField
  label="Answer"
  name="Answer"
  value={currentQuestion.Answer}
  onChange={handleInputChange}
  fullWidth
  variant="outlined"
  multiline       // حالت چندخطی
  minRows={4}     // حداقل 4 خط
  maxRows={10}    // حداکثر 10 خط
  sx={{ mb: 2 }}
  inputProps={{
    style: { resize: 'vertical' }, // برای اجازه‌ی کشیدن و تغییر اندازه
  }}
/>

              <TextField
                label="Weight"
                name="Zarib"
                type="number"
                value={currentQuestion.Zarib}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={isAdding ? addQuestion : editQuestion}
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {isAdding ? 'Add Question' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageQuestionsPage;
