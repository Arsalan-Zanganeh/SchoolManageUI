import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress, Box, Container, Alert, useTheme, useMediaQuery } from '@mui/material';

const ResetPasswordAdmin = () => {
    const [National_ID, setNationalId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/request-reset-email/`, { 
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
        <Container maxWidth="md">
            <Box 
                sx={{ 
                    width: isMobile ? '90%' : '400px', 
                    mx: 'auto', 
                    mt: isMobile ? 0 : 5, 
                    p: isMobile ? 2 : 4,
                    bgcolor: '#007BFF', 
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant={isMobile ? "h4" : "h3"} gutterBottom color="white" align="center">
                    Reset Password for Principal
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
                        color="secondary"
                        fullWidth 
                        disabled={loading}
                        sx={{ mt: 3, py: isMobile ? 1 : 1.5, fontSize: isMobile ? '1rem' : '1.1rem' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>
                </form>
                {message && (
                    <Alert severity="info" sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: 1 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default ResetPasswordAdmin;