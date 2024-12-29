import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DisciplinaryStatus = ({ goBack }) => {
  const [cases, setCases] = useState([]);
  const [disciplineScore, setDisciplineScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseRes, scoreRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-disciplinary-cases/`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-discipline-score/`, { credentials: 'include' }),
        ]);

        if (caseRes.ok) {
          const caseData = await caseRes.json();
          setCases(caseData);
        }

        if (scoreRes.ok) {
          const scoreData = await scoreRes.json();
          setDisciplineScore(scoreData.Grade);
        }
      } catch (error) {
        console.error('Error fetching disciplinary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
  sx={{
    position: { xs: 'relative', sm: 'absolute' },
    left: { xs: '10px', sm: '190px' },
    right: { xs: '10px', sm: '20px' },
    // width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 40px)' },
    maxWidth: { xs: '100%', sm: '1600px' },
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  {/* دکمه بازگشت و عنوان */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' }, // ستون در حالت گوشی، ردیف در دسکتاپ
      alignItems: 'center',
      justifyContent: { xs: 'center', sm: 'space-between' }, // فاصله مناسب در دسکتاپ
      position: 'relative',
      mb: 4,
      width: '100%',
    }}
  >
    {/* دکمه بازگشت */}
    <Box
  sx={{
    position: 'relative',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    mb: 3,
    textAlign: 'center',
  }}
>
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={goBack}
    variant="contained"
    color="primary"
    sx={{
      position: { sm: 'absolute' },
      left: { sm: 0 },
      mb: { xs: 2, sm: 0 },
    }}
  >
    Back
  </Button>

  <Typography
    variant="h4"
    sx={{
      fontWeight: 'bold',
      color: '#333',
      width: '100%',
      textAlign: 'center',
    }}
  >
    Disciplinary Status
  </Typography>
</Box>

  </Box>

  {/* نمایش نمره انضباط */}
  <Paper elevation={3} sx={{ padding: '16px', marginBottom: '20px', width: '100%' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
      Discipline Score: {disciplineScore || 'No Data'}
    </Typography>
  </Paper>

  {/* نمایش پرونده‌های انضباطی */}
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Case</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {cases.length > 0 ? (
          cases.map((item, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 0 ? '#E3F2FD' : '#E8F5E9',
                '&:hover': { backgroundColor: '#D1C4E9' },
                transition: 'background-color 0.3s',
              }}
            >
              <TableCell sx={{ fontWeight: '500' }}>{item.Case}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>No disciplinary cases available.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

  
  );
};

export default DisciplinaryStatus;
