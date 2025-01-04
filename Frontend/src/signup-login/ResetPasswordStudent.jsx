import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress, Box, Container, Alert, useTheme, useMediaQuery, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResetPasswordStudent = () => {
    const [National_ID, setNationalId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate(); // For navigation to Login page after password reset

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-reset-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ National_ID, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('A reset link has been sent to your email.');
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
        <Container maxWidth="lg"> {/* Larger container width */}
            <Box
                sx={{
                    width: isMobile ? '90%' : '600px', // Wider layout for larger screens
                    mx: 'auto',
                    mt: isMobile ? 0 : 5,
                    p: isMobile ? 3 : 5, // More padding for a spacious look
                    bgcolor: '#f5f5f5', // Light gray background
                    borderRadius: 3, // Rounded corners
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 255, 0.3)', // Glowing shadow
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center', // Center the content
                    transition: 'box-shadow 0.3s ease-in-out', // Smooth transition for hover effect
                    '&:hover': {
                        boxShadow: '0 4px 40px rgba(0, 0, 255, 0.5)', // Glowing effect on hover
                    },
                }}
            >
                {/* Changed header text */}
                <Typography variant={isMobile ? "h4" : "h2"} gutterBottom color="primary" align="center">
                    Welcome back!
                </Typography>
                
                {/* Changed subheading text */}
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
                    Reset Password for Student
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="National ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={National_ID}
                        onChange={(e) => setNationalId(e.target.value)}
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
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary" // Blue button color
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 4, py: 1.5, fontSize: isMobile ? '1rem' : '1.2rem', borderRadius: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>
                </form>
                {message && (
                    <Alert severity="info" sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: 1 }}>
                        {message}
                    </Alert>
                )}

                <Link
                    href="/signup-login"
                    underline="hover"
                    sx={{ mt: 2, fontSize: '1rem', color: 'primary.main' }}
                >
                    Return to LoginPage
                </Link>
            </Box>
        </Container>
    );
};

export default ResetPasswordStudent;
