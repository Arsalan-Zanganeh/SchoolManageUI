import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const CREATE_ESSAY_QUIZ_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/create_quiz/`;
const GET_ESSAY_QUIZZES_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher_quizzes/`;
const START_QUIZ_ENDPOINT = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/start_quiz/`;

// توابع کمکی
function parseCustomDateString(dateString) {
  // فرض بر این است که فرمت "YYYY-MM-DD HH:mm" دریافت می‌کنیم
  // اگر سرور تاریخ را به فرمت ISO می‌فرستد، این تابع را حذف کنید
  // و هنگام ذخیره در state همان استرینگ ISO را قرار دهید.
  if (!dateString) return null;
  const [datePart, timePart] = dateString.split(' ');
  if (!timePart) {
    // ممکن است فرمت 'YYYY-MM-DDTHH:mm:ss' باشد یا ISO، پس برمی‌گردیم new Date(dateString)
    return new Date(dateString);
  }
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return new Date(year, month - 1, day, hour, minute);
}

const TeacherEssayQuizList = () => {
  const { tcid } = useParams();
  const navigate = useNavigate();

  const [essayQuizzes, setEssayQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State برای دیالوگ ایجاد
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');

  // State برای دیالوگ انتشار
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openTime, setOpenTime] = useState('');
  const [durationHour, setDurationHour] = useState('');
  const [durationMinute, setDurationMinute] = useState('');

  useEffect(() => {
    const fetchEssayQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetch(GET_ESSAY_QUIZZES_ENDPOINT, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();

          // فرض می‌کنیم سرور هم‌اکنون OpenTime را به فرمت 'YYYY-MM-DD HH:mm' می‌فرستد:
          // هر کوییز را پارس می‌کنیم
          const parsedQuizzes = data.map((quiz) => {
            return {
              ...quiz,
              // اگر تمایل دارید مستقیماً Date ذخیره کنید (راه 1):
              // OpenTime: parseCustomDateString(quiz.OpenTime),
            };
          });
          setEssayQuizzes(parsedQuizzes);
        } else {
          console.error('Failed to fetch essay quizzes');
        }
      } catch (error) {
        console.error('Error fetching essay quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssayQuizzes();
  }, []);

  // ---- Create Dialog ----
  const handleOpenCreateDialog = () => {
    setMessage('');
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewQuizTitle('');
  };

  const handleCreateEssayQuiz = async () => {
    if (!newQuizTitle.trim()) {
      setMessage('Quiz title cannot be empty');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const resp = await fetch(CREATE_ESSAY_QUIZ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ Title: newQuizTitle }),
      });
      if (resp.ok) {
        const newQuiz = await resp.json();
        setEssayQuizzes((prev) => [...prev, newQuiz]);
        // setMessage('Essay quiz created successfully');
        handleCloseCreateDialog();
      } else {
        const errData = await resp.json();
        setMessage(`Failed to create essay quiz: ${errData.error || ''}`);
      }
    } catch (error) {
      console.error('Error creating essay quiz:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ---- Publish Dialog ----
  const handleOpenPublishDialog = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenTime('');
    setDurationHour('');
    setDurationMinute('');
    setPublishDialogOpen(true);
  };

  const handleClosePublishDialog = () => {
    setSelectedQuiz(null);
    setPublishDialogOpen(false);
  };

  const handleConfirmPublish = async () => {
    if (!selectedQuiz) return;
    if (!openTime) {
      alert('Please specify an open time');
      return;
    }

    setLoading(true);
    setMessage('');

    // فرمت ارسالی به سرور با T بین تاریخ و ساعت
    // برای مثال: 2024-12-30T09:00
    // سرور ممکن است آن را با فرمت دلخواه ذخیره کند.
    try {
      const resp = await fetch(START_QUIZ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedQuiz.id,
          OpenTime: openTime.replace('T', ' '), // "YYYY-MM-DD HH:mm"
          DurationHour: parseInt(durationHour, 10) || 0,
          DurationMinute: parseInt(durationMinute, 10) || 0,
        }),
      });
      if (resp.ok) {
        const result = await resp.json();

        // اگر سرور نتیجه را با فرمت "YYYY-MM-DD HH:mm" برگرداند،
        // آن را برای کوییز در استیت پارس می‌کنیم. 
        // (اگر فرمت ISO باشد، فقط همان را ست کنید.)
        const updatedOpenTime = parseCustomDateString(result.OpenTime);

        setEssayQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.id === selectedQuiz.id
              ? {
                  ...quiz,
                  // در اینجا می‌توانید یک شیٔ تاریخ واقعی ذخیره کنید
                  // یا همچنان استرینگ را ذخیره کنید. اینجا ما شیٔ Date ذخیره می‌کنیم:
                  OpenTime: updatedOpenTime,
                  DurationHour: result.DurationHour,
                  DurationMinute: result.DurationMinute,
                  Is_Published: true,
                }
              : quiz
          )
        );
        // setMessage('Quiz published successfully');
        handleClosePublishDialog();
      } else {
        const errData = await resp.json();
        setMessage(`Failed to publish quiz: ${errData.error || ''}`);
      }
    } catch (error) {
      console.error('Error publishing quiz:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(GET_ESSAY_QUIZZES_ENDPOINT, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setEssayQuizzes(data);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
  
    fetchQuizzes();
  
    const interval = setInterval(fetchQuizzes, 1000); // هر 10 ثانیه
    return () => clearInterval(interval);
  }, []);
  

  // ---- Rendering ----
  return (
    <Box
      sx={{
        p: 3,
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#EFF4FB',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#3F51B5',
        }}
      >
        Essay Quizzes for Class {tcid}
      </Typography>

      {message && (
        <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {message}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenCreateDialog}
        sx={{
          mb: 3,
          fontWeight: 'bold',
          fontSize: '1rem',
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        Create Essay Quiz
      </Button>

      <Stack spacing={3}>
        {essayQuizzes.map((quiz) => {
          // اگر در بالا هنگام لود، به صورت Date در state ذخیره کرده باشید، اینجا مستقیم quiz.OpenTime را Date دارید
          // در غیر این صورت اگر استرینگ باشد، باید new Date(quiz.OpenTime) بزنید
          
          let open = null;
          // اگر شما در state به صورت تاریخ ذخیره کرده‌اید:
          if (quiz.OpenTime instanceof Date) {
            open = quiz.OpenTime;
          } else if (typeof quiz.OpenTime === 'string') {
            // اگر همچنان استرینگ است، تبدیل کنید:
            open = parseCustomDateString(quiz.OpenTime);
          }

          const now = new Date();
          const duration = (quiz.DurationHour || 0) * 60 + (quiz.DurationMinute || 0);
          const close = open ? new Date(open.getTime() + duration * 60 * 1000) : null;

          // حالات مختلف
          const isScheduled = open && now < open; // هنوز شروع نشده
          const isBeforeEnd = open && close && now >= open && now <= close; // در بازه فعال
          const isFinished = open && close && now > close; // زمانش تمام شده

          return (
            <Paper
              key={quiz.id}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'white',
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {quiz.Title}
              </Typography>

              {/* Time Information */}
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Open Time:</strong>{' '}
                  {open ? open.toLocaleString() : 'Not set'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ends at:</strong>{' '}
                  {close ? close.toLocaleString() : 'Not set'}
                </Typography>
              </Box>

              {/* Buttons based on status */}
              <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' }, // عمودی در موبایل، افقی در دسکتاپ
    justifyContent: { xs: 'center', sm: 'space-between' }, // وسط‌چین در موبایل
    alignItems: 'center',
    gap: 2, // فاصله بین دکمه‌ها
    mt: 2,
  }}
>
  {/* دکمه‌های مختلف */}
  {!quiz.Is_Published && (
    <Button
      variant="contained"
      color="primary"
      startIcon={<PublishIcon />}
      fullWidth={window.innerWidth <= 600} // عرض کامل در موبایل
      onClick={() => handleOpenPublishDialog(quiz)}
    >
      Publish
    </Button>
  )}

  {quiz.Is_Published && isScheduled && (
    <Button
      variant="contained"
      disabled
      sx={{
        backgroundColor: 'gray',
        color: 'white',
        cursor: 'not-allowed',
        fullWidth: { xs: true, sm: false }, // عرض کامل در موبایل
      }}
    >
      Scheduled
    </Button>
  )}

  {quiz.Is_Published && isBeforeEnd && (
    <Button
      variant="contained"
      disabled
      sx={{
        backgroundColor: 'gray',
        color: 'white',
        cursor: 'not-allowed',
        fullWidth: { xs: true, sm: false }, // عرض کامل در موبایل
      }}
    >
      Published (Active)
    </Button>
  )}

  {quiz.Is_Published && isFinished && (
    <Button
      variant="contained"
      color="success"
      fullWidth={window.innerWidth <= 600} // عرض کامل در موبایل
      onClick={() =>
        navigate(
          `/teacher-dashboard/teacher-classes/${tcid}/essay-quizzes/${quiz.id}/results`
        )
      }
    >
      View Results
    </Button>
  )}

  {/* دکمه ویرایش */}
  <IconButton
    color="secondary"
    onClick={() =>
      navigate(`/teacher-dashboard/teacher-classes/${tcid}/essay-quizzes/${quiz.id}`)
    }
  >
    <EditIcon />
  </IconButton>
</Box>

            </Paper>
          );
        })}
      </Stack>

      {/* Dialog ایجاد کوئیز */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Create New Essay Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            type="text"
            fullWidth
            value={newQuizTitle}
            onChange={(e) => setNewQuizTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEssayQuiz} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog پابلیش */}
      <Dialog
        open={publishDialogOpen}
        onClose={handleClosePublishDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Publish Quiz</DialogTitle>
        <DialogContent>
          <TextField
            label="Open Time"
            type="datetime-local"
            fullWidth
            margin="dense"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Duration (Hours)"
            type="number"
            fullWidth
            margin="dense"
            value={durationHour}
            onChange={(e) => setDurationHour(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Duration (Minutes)"
            type="number"
            fullWidth
            margin="dense"
            value={durationMinute}
            onChange={(e) => setDurationMinute(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePublishDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPublish}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherEssayQuizList;
