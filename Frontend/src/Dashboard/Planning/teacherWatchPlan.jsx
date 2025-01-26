import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem, IconButton, Tabs, Tab, styled, useMediaQuery } from '@mui/material';
import AddPlanFormT from './AddPlanT';
import Swal from 'sweetalert2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { MoreVert as MoreVertIcon, Comment as CommentIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon , Visibility as VisibilityIcon, AddComment as AddCommentIcon} from '@mui/icons-material';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';


const apiBaseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline`;

const TaskBox = styled(Box)(({ theme, startTime, duration, isMobile }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    position: 'absolute',
    left: isMobile ? 0 : `${(startTime / 60) * 100}%`,
    top: isMobile ? `${(startTime / 60) * 100}%` : 5,
    width: isMobile ? '100%' : `${(duration / 60) * 100}%`,
    height: isMobile ? `${(duration / 60) * 100}%` : 50,
    boxSizing: 'border-box',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.8,
    justifyContent: 'center',
    zIndex: 1
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#0036AB',
        },
        secondary: {
            main: '#673AB7',
        },
    },
});

const getStartOfWeek = (date) => {
    return startOfWeek(date, { weekStartsOn: 6 }); // Start week on Saturday
};

const formatWeekLabel = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7); // Get the end of the week (Friday)
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

const formatTime = (hours, minutes) => {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
};

const TeacherViewPlanner = ({ onBack, studentid }) => {
    const [plans, setPlans] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [addCommentDialogOpen, setAddCommentDialogOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const commentsPerPage = 5;
    const isMobile = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [anchorEl, setAnchorEl] = useState(null);


    const fetchPlans = async (startDate, endDate) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-watch-student-plans/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ Student_ID: studentid })
            });
            if (!response.ok) {
                throw new Error('Server error');
            }
            const data = await response.json();
            const filteredPlans = data.filter(plan => {
                const planDate = new Date(plan.StartDate.replace(' ', 'T'));
                return (planDate >= startDate && planDate <= endDate);
            });
            setPlans(filteredPlans);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const fetchComments = async (planId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-watch-feedbacks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ StudentPlanning_ID: planId })
            });
            if (!response.ok) {
                throw new Error('Server error');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch comments. Please try again.', 'error');
        }
    };

    const addPlan = async (plan) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-add-student-plan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(plan)
            });
            if (!response.ok) {
                Swal.fire('Error', error.message, 'error');
            }
            const startDate = getStartOfWeek(selectedDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            fetchPlans(startDate, endDate);
        } catch (error) {
            Swal.fire('Error', 'Failed to add plan. Please try again.', 'error');
        }
    };

    const deletePlan = async () => {
        try {
            await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-delete-plan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ id: selectedPlan.id })
            });
            const startDate = getStartOfWeek(selectedDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            fetchPlans(startDate, endDate);
            setDetailsDialogOpen(false);
            setSelectedPlan(null);
            setAnchorEl(null);
        } catch (error) {
            Swal.fire('Error', 'Failed to delete plan. Please try again.', 'error');
        }
    };

    const handleContextMenu = (event, plan) => {
        event.preventDefault();
        setSelectedPlan(plan);
        setAnchorEl(event.currentTarget);
    };

    const handleOpenDetails = async () => {
        setAnchorEl(null);
        await fetchComments(selectedPlan.id);
        setDetailsDialogOpen(true);
    };

    const handleAddComment = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-add-feed-back/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ StudentPlanning_ID: selectedPlan.id, Feedback: newComment })
            });
            if (!response.ok) {
                throw new Error('Server error');
            }
            await fetchComments(selectedPlan.id);
            setAddCommentDialogOpen(false);
            setNewComment('');
        } catch (error) {
            Swal.fire('Error', 'Failed to add comment. Please try again.', 'error');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/discipline/teacher-delete-feedback/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ TeacherFeedback_ID: commentId })
            });
            if (!response.ok) {
                throw new Error('Server error');
            }
            await fetchComments(selectedPlan.id);
        } catch (error) {
            Swal.fire('Error', 'You can only delete your own comments!', 'error');
            setDetailsDialogOpen(false);
        }
    };

    const handlePreviousWeek = () => {
        setSelectedDate(prevDate => subWeeks(prevDate, 1));
    };

    const handleNextWeek = () => {
        setSelectedDate(prevDate => addWeeks(prevDate, 1));
    };

    const generateSchedule = () => {
        const schedule = {};
        const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const hoursOfDay = Array.from({ length: 17 }, (_, i) => i + 7); // Hours from 7:00 AM to 12:00 AM

        // Initialize schedule structure
        daysOfWeek.forEach(day => {
            schedule[day] = hoursOfDay.map(() => []);
        });

        // Populate schedule with plans
        plans.forEach(plan => {
            const planDate = new Date(plan.StartDate.replace(' ', 'T'));
            const day = planDate.toLocaleString('en-US', { weekday: 'long' });
            const startHour = planDate.getHours();
            const startMinutes = planDate.getMinutes();
            const duration = parseInt(plan.Duration, 10);

            if (!schedule[day]) {
                schedule[day] = Array(17).fill([]); // Initialize for hours from
            }
                if (startHour >= 7 && startHour < 24) {
                    const hourIndex = startHour - 7; // Adjust index for the 7:00 AM to 12:00 AM range
                    schedule[day][hourIndex].push({
                        id: plan.id,
                        title: plan.Title,
                        startHour,
                        startMinutes,
                        duration,
                        Explanation: plan.Explanation,
                        StartDate: plan.StartDate,
                    });
                }
            });
    
            setSchedule(schedule);
        };
    
        useEffect(() => {
            const startDate = getStartOfWeek(selectedDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            fetchPlans(startDate, endDate);
            generateSchedule();
        }, [selectedDate]);
    
        useEffect(() => {
            generateSchedule();
        }, [plans]);
    
    const handlePrevComments = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextComments = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.floor(comments.length / commentsPerPage)));
    };

    const currentComments = comments.slice(currentPage * commentsPerPage, (currentPage + 1) * commentsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <Container component={Box} border={1} borderColor="grey.400" borderRadius={8} padding={3} marginTop={5}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Box>
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginRight: '10px', marginBottom: '10px' }}>Add Task</Button>
                        <Button onClick={onBack} variant="contained" color="secondary" style={{ marginRight: '10px', marginBottom: '10px' }}>Back</Button>
                    </Box>
                    <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{display:'flex', flexDirection:'column'}}>
                            <DatePicker
                                views={['year', 'month','day']}
                                label="Select Week"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(getStartOfWeek(newValue))}
                                renderInput={(params) => <TextField {...params} helperText={formatWeekLabel(selectedDate)} />}
                            />
                            <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between' , mt:2}}>
                                <Button variant="outlined" color="primary" onClick={handlePreviousWeek} style={{ marginRight: '5px' ,maxWidth: '50%',  }}>&lt; Prev</Button>
                                <Button variant="outlined" color="primary" onClick={handleNextWeek} style={{ marginLeft: '5px' ,maxWidth: '50%'}}>Next &gt;</Button>
                            </Box>
                        </Box>
                    </LocalizationProvider>
                    </Box>
                </Box>
                <TableContainer component={Paper} style={{ position: 'relative' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{isMobile ? 'Hour' : 'Day'}</TableCell>
                                {isMobile
                                    ? ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri'].map(day => (
                                        <TableCell key={day} style={{ borderLeft: '1px solid #ddd', width: '80px' }}>{day}</TableCell>
                                    ))
                                    : Array.from({ length: 17 }, (_, i) => i + 7).map(hour => (
                                        <TableCell key={hour} style={{ borderLeft: '1px solid #ddd', width: '25px' }}>{`${hour}:00`}</TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isMobile
                                ? Array.from({ length: 17 }, (_, i) => i + 7).map(hour => (
                                    <TableRow key={hour}>
                                        <TableCell>{`${hour}:00`}</TableCell>
                                        {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                            <TableCell key={day} style={{ borderLeft: '1px solid #ddd', height: '60px', position: 'relative' }}>
                                                {schedule[day]?.[hour - 7]?.map((task, index) => (
                                                    <TaskBox
                                                        key={index}
                                                        startTime={task.startMinutes}
                                                        duration={task.duration}
                                                        onClick={(event) => handleContextMenu(event, task)}
                                                        isMobile={isMobile}
                                                    >
                                                        {task.title}
                                                        <IconButton
                                                            size="small"
                                                            onClick={(event) => handleContextMenu(event, task)}
                                                            style={{ color: 'white', marginLeft: 'auto' }}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TaskBox>
                                                ))}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                    <TableRow key={day}>
                                        <TableCell>{day}</TableCell>
                                        {Array.from({ length: 17 }, (_, i) => i + 7).map(hour => (
                                            <TableCell key={hour} style={{ borderLeft: '1px solid #ddd', height: '60px', position: 'relative' }}>
                                                {schedule[day]?.[hour - 7]?.map((task, index) => (
                                                    <TaskBox
                                                        key={index}
                                                        startTime={task.startMinutes}
                                                        duration={task.duration}
                                                        onClick={(event) => handleContextMenu(event, task)}
                                                        isMobile={isMobile}
                                                    >
                                                        {task.title}
                                                        <IconButton
                                                            size="small"
                                                            onClick={(event) => handleContextMenu(event, task)}
                                                            style={{ color: 'white', marginLeft: 'auto' }}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TaskBox>
                                                ))}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={handleOpenDetails}>
                    <VisibilityIcon style={{ color: 'black', marginRight:'5px'}}/>
                    See Details
                    </MenuItem>
                    <MenuItem onClick={() => setAddCommentDialogOpen(true)}>
                    <AddCommentIcon style={{ color: 'black' , marginRight:'5px'}}/>
                    Add Comment
                    </MenuItem>
                    <MenuItem onClick={deletePlan}>
                    <DeleteIcon style={{ color: 'red' , marginRight:'5px'}}/>
                    Delete Task 
                    </MenuItem>
                </Menu>
                <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)}>
                    <DialogTitle >
                        {tabValue === 0 ? ('Task Details'):('Comments')}
                        {tabValue === 0 ? (
                            <IconButton onClick={() => setTabValue(1)} style={{ float: 'right' }}>
                            <CommentIcon />
                        </IconButton>
                        ):(
                            <IconButton onClick={() => setTabValue(0)}>
                            <ArrowBackIcon />
                        </IconButton>
                        )} 
                    </DialogTitle>
                    <DialogContent>
                        {tabValue === 0 && (
                            <>
                                <Typography>Full Title: {selectedPlan?.title}</Typography>
                                <Typography>Start Date: {selectedPlan ? new Date(selectedPlan.StartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} : {selectedPlan ? formatTime(selectedPlan.startHour, selectedPlan.startMinutes) : ''}</Typography>
                                <Typography>Duration: {selectedPlan?.duration} minutes</Typography>
                                <Typography>Explanation: {selectedPlan?.Explanation}</Typography>
                            </>
                        )}
                        {tabValue === 1 && (
                            <>
                                <Box>
                                {currentComments.length ? (
                                    currentComments.map((comment, index) => (
                                        <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={2} p={2} bgcolor="grey.100" borderRadius= {theme.shape.borderRadius} backgroundColor= {theme.palette.background} elevation={3}>
                                            
                                            <Typography>{comment.Teacher_First_Name}{comment.Teacher_Last_Name}: <br />{comment.Feedback}</Typography>
                                            <IconButton onClick={() => handleDeleteComment(comment.id)} style={{ color: 'red' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>No comments yet</Typography>
                                )}
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Button onClick={handlePrevComments} disabled={currentPage === 0} color="primary" variant="outlined">&lt;</Button>
                                    <Button onClick={handleNextComments} disabled={(currentPage + 1) * commentsPerPage >= comments.length} color="primary" variant="outlined">&gt;</Button>
                                </Box>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetailsDialogOpen(false)} color="primary">Close</Button>
                        <Button onClick={deletePlan} color="secondary">Delete Task</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={addCommentDialogOpen} onClose={() => setAddCommentDialogOpen(false)}>
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Comment"
                            type="text"
                            fullWidth
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            inputProps={{ maxLength: 100 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddCommentDialogOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleAddComment} color="primary">Add Comment</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Add New Plan</DialogTitle>
                    <DialogContent>
                        <AddPlanFormT addPlan={addPlan} back={() => setOpen(false)} student_id={studentid}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
    };
    

export default TeacherViewPlanner;
