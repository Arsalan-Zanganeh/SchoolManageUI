import React, { useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';


const AddPlanForm = ({ addPlan , back}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [explanation, setExplanation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedTime = startTime ? `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}` : '';
        const formattedStartDate = `${formattedDate} ${formattedTime}`;
        addPlan({ StartDate: formattedStartDate, Title: title, Duration: duration, Explanation: explanation });
        back()
    };

    const handleBlur = (e) => {
        const value = Math.max(15, Math.min(180, e.target.value));
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
                    maxTime={new Date(0, 0, 0, 23, 0)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    ampm={false}
                />
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
                    inputProps={{ min: 10, max: 180, step: 5 }}
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

export default AddPlanForm;
