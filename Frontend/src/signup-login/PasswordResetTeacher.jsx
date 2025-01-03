import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress, Box, Container, Alert, useTheme, useMediaQuery, Link, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const PasswordResetTeacher = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/teacher-reset-complete/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    uidb64, 
                    token, 
                    password,
                    confirm_password: confirmPassword
                }),
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
        <Container maxWidth="lg">
            <Box
                sx={{
                    width: isMobile ? '90%' : '600px',
                    mx: 'auto',
                    mt: isMobile ? 0 : 5,
                    p: isMobile ? 3 : 5,
                    bgcolor: '#f5f5f5',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 255, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 4px 40px rgba(0, 0, 255, 0.5)',
                    },
                }}
            >
                <Typography variant={isMobile ? "h4" : "h2"} gutterBottom color="primary" align="center">
                    Confirm New Password!
                </Typography>
                
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
                    Reset Password for Teacher
                </Typography>
                
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="New Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                        }}
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
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                        }}
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
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ 
                            mt: 4, 
                            py: 1.5, 
                            fontSize: isMobile ? '1rem' : '1.2rem', 
                            borderRadius: 2 
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                </form>
                
                {message && (
                    <Alert 
                        severity={message.includes('successfully') ? 'success' : 'error'} 
                        sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: 1, width: '100%' }}
                    >
                        {message}
                    </Alert>
                )}

                <Link
                    href="/"
                    underline="hover"
                    sx={{ mt: 2, fontSize: '1rem', color: 'primary.main' }}
                >
                    Return to LoginPage
                </Link>
            </Box>
        </Container>
    );
};

export default PasswordResetTeacher;
