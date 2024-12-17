import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

function SignUpStudent({ goBack }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [fatherphone, setFatherPhoneNumber] = useState('');
  const [fatherfname, setFatherFirstName] = useState('');
  const [gradelevel, setGradeLevel] = useState('');
  const [password, setPassword] = useState('');
  const [Parent_password, setParent_password] = useState('');
  const [Email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landline, setLandLine] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !nationalid || !fatherphone || !password || !Parent_password || !fatherfname || !Email || !address || !landline || !gradelevel) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const submit = await fetch("http://127.0.0.1:8000/api/add_student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          National_ID: nationalid,
          Father_Phone_Number: fatherphone,
          password,
          Parent_password,
          Email: Email,
          Father_first_name: fatherfname,
          Grade_Level: gradelevel,
          Address: address,
          LandLine: landline,
        }),
      });
      if (!submit.ok) {
        const errorData = await submit.json();
        let errorMessage = '';
        for (const key in errorData) {
          if (errorData.hasOwnProperty(key)) {
            errorMessage += `${key}: ${errorData[key].join(', ')}\n`;
          }
        }
        Swal.fire({
          title: 'Error',
          text: errorMessage || 'Registration failed. Please check the details and try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire('Success', 'Registration successful!', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Server error or network issue. Please try again.', 'error');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setNationalid('');
    setFatherPhoneNumber('');
    setFatherFirstName('');
    setPassword('');
    setParent_password('');
    setEmail('');
    setAddress('');
    setLandLine('');
    setGradeLevel('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          padding: 4,
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Add New Student
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Grid container spacing={2}>
            {[
              { label: 'First Name', value: firstname, setValue: setFirstname },
              { label: 'Last Name', value: lastname, setValue: setLastname },
              { label: 'National ID', value: nationalid, setValue: setNationalid },
              { label: 'Father Phone Number', value: fatherphone, setValue: setFatherPhoneNumber },
              { label: 'Father First Name', value: fatherfname, setValue: setFatherFirstName },
              { label: 'Grade Level', value: gradelevel, setValue: setGradeLevel },
              { label: 'Password', type: 'password', value: password, setValue: setPassword },
              { label: 'Parent Password', type: 'password', value: Parent_password, setValue: setParent_password },
              { label: 'Email', value: Email, setValue: setEmail },
              { label: 'Land Line', value: landline, setValue: setLandLine },
            ].map((field, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type || 'text'}
                  variant="outlined"
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 50,
                    },
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Home Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>
          <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between', // فاصله یکنواخت بین دکمه‌ها
    gap: 2, // فاصله بین دکمه‌ها
    mt: 2,
  }}
>
  <Button
    variant="contained"
    startIcon={<ArrowBackIcon />}
    onClick={goBack}
    sx={{
      flex: 1,
      borderRadius: 50,
      backgroundColor: '#6A1B9A',
      color: '#fff',
      ':hover': {
        backgroundColor: '#4A0072',
      },
    }}
  >
    Back
  </Button>
  <Button
    variant="contained"
    color="primary"
    type="submit"
    sx={{
      flex: 1,
      borderRadius: 50,
    }}
  >
    Submit
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    type="button"
    onClick={resetForm}
    sx={{
      flex: 1,
      borderRadius: 50,
    }}
  >
    Reset
  </Button>
</Box>

        </Box>
      </Paper>
    </Box>
  );
}

export default SignUpStudent;