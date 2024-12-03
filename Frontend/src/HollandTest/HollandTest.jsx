import React from 'react';
import { Button, Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HollandTest = () => {
  const navigate = useNavigate();

  const startTest = () => {
    navigate('/holland-test/questions');
  };

  const viewPreviousResults = () => {
    navigate('/holland-test/previous-results');
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: { xs: 'auto', sm: 0 }, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: { xs: '100%', sm: 700 },
          width: '100%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ textAlign: 'center', padding: { xs: '20px', sm: '40px 30px' } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: '#1565c0', fontWeight: 'bold', marginBottom: '20px' }}
          >
            Welcome to the Holland Test
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: { xs: '16px', sm: '18px' },
              color: '#455a64',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}
          >
            The Holland Test helps you discover your personality type and find careers
            that best match your interests. The test consists of **30 carefully designed
            questions** that will assess your preferences across six main personality
            categories.
          </Typography>

          <Divider sx={{ margin: { xs: '20px 0', sm: '30px 0' } }} />

          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              color: '#455a64',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}
          >
            Here's how the test works:
            <ol style={{ textAlign: 'left', marginLeft: '10px', color: '#455a64' }}>
              <li>You will be presented with a series of statements about your preferences and interests.</li>
              <li>Simply select the option that best describes you.</li>
              <li>At the end of the test, you will receive a personalized report suggesting suitable career paths based on your answers.</li>
            </ol>
          </Typography>

          <Box sx={{ marginTop: { xs: '20px', sm: '40px' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={startTest}
              sx={{
                padding: { xs: '10px 20px', sm: '12px 24px' },
                fontSize: { xs: '14px', sm: '16px' },
                borderRadius: '8px',
                textTransform: 'none',
                marginBottom: { xs:'10px', sm:'0'},
                marginRight:{sm:'10px'}
              }}
            >
              Start Test
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={viewPreviousResults}
              sx={{
                padding:{ xs:'10px 20px', sm:'12px 24px'},
                fontSize:{xs:'14px', sm:'16px'},
                borderRadius:'8px',
                textTransform:'none',
                marginBottom:{xs:'10px', sm:'0'},
                marginRight:{sm:'10px'}
              }}
            >
              View Previous Results
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/student-dashboard')}
              sx={{
                padding:{ xs:'10px 20px', sm:'12px 24px'},
                fontSize:{xs:'14px', sm:'16px'},
                borderRadius:'8px',
                textTransform:'none'
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