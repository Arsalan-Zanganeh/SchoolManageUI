import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography,Box,MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';

const AddPlanFormT = ({ addPlan , back,student_id}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(5);
    const [timeError, setTimeError] = useState('');
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        if (hours < 7 || hours >= 24) {
            now.setHours(7, 0, 0, 0);
        }
        setStartTime(now);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        if (endDateTime.getDate() !== startDateTime.getDate()) {
            setTimeError('The task duration extends beyond midnight. Please adjust the duration or start time.');
            return;
        }
        setTimeError('');
        const formattedDate = format(startDate, 'yyyy-MM-dd');
        const formattedTime = format(startTime, 'HH:mm');
        const formattedStartDate = `${formattedDate}T${formattedTime}:00`;
        addPlan({ Student_ID: student_id,StartDate: formattedStartDate, Title: title, Duration: duration, Explanation: explanation });
        back()
    };

    const handleBlur = (e) => {
        const value = Math.max(5, Math.min(180, e.target.value));
        setDuration(value);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
            <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <MobileTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    minTime={new Date(0, 0, 0, 7, 0)}
                    maxTime={new Date(0, 0, 0, 23, 54)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    ampm={false}
                />
                {timeError && (
                    <Box mt={1}>
                        <Typography color="error" variant="body2">{timeError}</Typography>
                    </Box>
                )}
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ maxLength: 50 }}
                />
                <TextField
                    label="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                    inputProps={{ min: 5, max: 180, step: 5 }}
                    onBlur={handleBlur}
                />
                <TextField
                    label="Explanation"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    fullWidth
                    required
                    inputProps={{ maxLength: 50 }}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">Add Plan</Button>
            </form>
        </LocalizationProvider>
    );
};

export default AddPlanFormT;
