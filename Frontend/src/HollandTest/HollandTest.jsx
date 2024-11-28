import React from 'react';
import { Button, Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HollandTest = () => {
  const navigate = useNavigate();

  const startTest = () => {
    navigate('/holland-test/questions'); 
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: '100%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ textAlign: 'center', padding: '40px 30px' }}>
          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ color: '#1565c0', fontWeight: 'bold', marginBottom: '20px' }}
          >
            Welcome to the Holland Test
          </Typography>

          {/* Explanation */}
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: '18px',
              color: '#455a64',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}
          >
            The Holland Test helps you discover your personality type and find careers
            that best match your interests. The test consists of **30 carefully designed
            questions** that will assess your preferences across six main personality
            categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.
          </Typography>

          {/* Divider */}
          <Divider sx={{ margin: '30px 0' }} />

          {/* How the Test Works */}
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: '16px',
              color: '#455a64',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}
          >
            Here's how the test works:
            <ol style={{ textAlign: 'left', marginLeft: '10px', color: '#455a64' }}>
              <li>
                You will be presented with a series of statements about your preferences and interests.
              </li>
              <li>Simply select the option that best describes you.</li>
              <li>
                At the end of the test, you will receive a personalized report suggesting suitable
                career paths based on your answers.
              </li>
            </ol>
          </Typography>

          {/* Buttons */}
          <Box sx={{ marginTop: '40px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={startTest}
              sx={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                textTransform: 'none',
                marginRight: '10px',
              }}
            >
              Start Test
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/student-dashboard')}
              sx={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HollandTest;
