import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Snackbar } from '@mui/material';
import { Edit, Delete, AddCircle } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

const QuizPage = () => {
  const { qid } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [questionData, setQuestionData] = useState({
    Question_ID : '',
    Question: '',
    Option1: '',
    Option2: '',
    Option3: '',
    Option4: '',
    Answer: '',
    Explanation: '',
  });
  const [isAdding, setIsAdding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher-quiz-questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ QuizTeacher: qid }),
      });

      if (!response.ok) throw new Error('Failed to fetch questions');

      const data = await response.json();
      setQuiz({ questions: data });
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error loading quiz questions');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [qid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleQuestionDialogOpen = () => {
    setIsAdding(true);
    setQuestionData({
      Question_ID: '',
      Question: '',
      Option1: '',
      Option2: '',
      Option3: '',
      Option4: '',
      Answer: '',
      Explanation: '',
    });
    setOpenDialog(true);
  };

  const addQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher-add-quiz-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          QuizTeacher: qid,
          Question: questionData.Question,
          Option1: questionData.Option1,
          Option2: questionData.Option2,
          Option3: questionData.Option3,
          Option4: questionData.Option4,
          Answer: questionData.Answer,
          Explanation: questionData.Explanation,
        }),
      });

      if (!response.ok) throw new Error('Failed to add question');

      const data = await response.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: [...(prevQuiz?.questions || []), data],
      }));

      setSnackbarMessage('Question added successfully');
      setSnackbarOpen(true);
      setOpenDialog(false);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error adding question');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher-edit-quiz-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          QuizTeacher: qid, 
          Question_ID: id, 
          Question: questionData.Question,
          Option1: questionData.Option1,
          Option2: questionData.Option2,
          Option3: questionData.Option3,
          Option4: questionData.Option4,
          Answer: questionData.Answer,
          Explanation: questionData.Explanation,
        }),
      });

      if (!response.ok) throw new Error('Failed to update question');

      const updatedQuestion = await response.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.map((question) =>
          question.Question_ID === id ? updatedQuestion : question
        ),
      }));

      setSnackbarMessage('Question updated successfully');
      setSnackbarOpen(true);
      setOpenDialog(false);
      fetchQuestions();
    } catch (error) {
        console.log(id) ;
      console.error(error);
      setSnackbarMessage('Error updating question');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher-delete-quiz-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          QuizTeacher: qid, 
          Question_ID: id, 
        }),
      });
  
      if (!response.ok) throw new Error('Failed to delete question');
  
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.filter((question) => question.id !== id),
      }));
  
      setSnackbarMessage('Question deleted successfully');
      setSnackbarOpen(true);
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
      <Box sx={{ 
        backgroundColor: '#DCE8FD' ,
        height : '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        //   bottom: 0, 
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        
      }}>  
        <Box sx={{
             p: 4, maxWidth: '100%', mx: 'auto', position: 'relative' }}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              Quiz Management: {quiz?.Title}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              onClick={handleQuestionDialogOpen}
              sx={{ borderRadius: 8, mt: 2, mb: 3 }}
            >
              Add New Question
            </Button>
            <Box
              sx={{
                maxWidth: '100%',
                maxHeight: '600px',
                overflowY: 'auto',
                pr: 2,
                pl: 2,
                py: 1,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#fff',
              }}
            >
              <Grid container spacing={3}>
                {quiz?.questions && quiz.questions.length > 0 ? (
                  quiz.questions.map((question) => (
                    <Grid item xs={12} key={question.id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          mb: 3,
                          minWidth: { xs: '100%', sm: '800px' },
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography variant="subtitle1" 
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: '1.25rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis', 
                            overflow: 'hidden',
                            display: 'block',
                          }}
                        >
                          {question.Question}
                        </Typography>
                        <Typography variant="body2"   sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          1. {question.Option1}
                        </Typography>
                        <Typography variant="body2" 
                        sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          2. {question.Option2}
                        </Typography>
                        <Typography variant="body2" 
                        sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          3. {question.Option3}
                        </Typography>
                        <Typography variant="body2" 
                        sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          4. {question.Option4}
                        </Typography>
                        <Typography variant="body2" 
                        sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          Correct Answer: Option {question.Answer}
                        </Typography>
                        <Typography variant="body2" 
                        sx={{
                            mb: 1,
                            fontSize: '1rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }}>
                          Explanation: {question.Explanation || 'No explanation provided.'}
                        </Typography>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => {
                              setIsAdding(false);
                              setQuestionData({
                                Question_ID : question.id ,
                                Question: question.Question,
                                Option1: question.Option1,
                                Option2: question.Option2,
                                Option3: question.Option3,
                                Option4: question.Option4,
                                Answer: question.Answer,
                                Explanation: question.Explanation,
                              });
                              setOpenDialog(true);
                            }}
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
                        minWidth: { xs: '100%', sm: '800px' },
                        backgroundColor: '#fff',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        No questions available.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>

          <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center' }}>
              {isAdding ? 'Add New Question' : 'Edit Question'}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Question"
                name="Question"
                value={questionData.Question}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Option 1"
                name="Option1"
                value={questionData.Option1}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Option 2"
                name="Option2"
                value={questionData.Option2}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Option 3"
                name="Option3"
                value={questionData.Option3}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Option 4"
                name="Option4"
                value={questionData.Option4}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Select
                label="Answer"
                name="Answer"
                value={questionData.Answer}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select an Answer
                </MenuItem>
                <MenuItem value={1}>Option 1</MenuItem>
                <MenuItem value={2}>Option 2</MenuItem>
                <MenuItem value={3}>Option 3</MenuItem>
                <MenuItem value={4}>Option 4</MenuItem>
              </Select>
              <TextField
                label="Explanation"
                name="Explanation"
                value={questionData.Explanation}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={isAdding ? addQuestion : () => updateQuestion(questionData.Question_ID)}
                color="primary"
                variant="contained"
              >
                {isAdding ? 'Add Question' : 'Update Question'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default QuizPage;
