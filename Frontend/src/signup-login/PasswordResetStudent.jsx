import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, CircularProgress, Box, Container, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordResetStudent = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/student-reset-complete/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uidb64, token, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password has been reset successfully.');
                window.alert('Password has been reset successfully.');
                navigate('/');
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box 
                sx={{ 
                    maxWidth: 400, 
                    mx: 'auto', 
                    mt: 5, 
                    p: 3, 
                    bgcolor: '#007BFF', 
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" gutterBottom color="white">
                    Reset Password for Student
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                </form>
                {message && (
                    <Typography variant="body2" color="error" sx={{ mt: 2, bgcolor: 'white', p: 1, borderRadius: 1 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default PasswordResetStudent;
