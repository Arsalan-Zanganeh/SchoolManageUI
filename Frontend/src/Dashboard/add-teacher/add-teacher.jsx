import React, { useState, useEffect } from 'react';
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

function SignUpTeacher({ goBack }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !nationalid || !phonenumber || !password || !password2 || !address) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    try {
      const submit = await fetch("http://127.0.0.1:8000/api/add_teacher/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          National_ID: nationalid,
          Phone_Number: phonenumber,
          Email: Email,
          password,
          password2,
          Address: address,
        }),
      });

      if (!submit.ok) {
        const errorData = await submit.json();

        if (errorData) {
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
          Swal.fire('Error', 'An unknown error occurred. Please try again later.', 'error');
        }
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
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setAddress('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          padding: 4,
          borderRadius: 4, // گرد کردن کادر اصلی
        }}
      >
       <Box
  sx={{
    display: 'flex',
    flexDirection: 'column', // تغییر جهت برای ایجاد خط جدید
    alignItems: 'center', // مرکز کردن محتوا
    mb: 3,
  }}
>


  {/* افزودن فاصله بین دکمه و متن */}
  <Box sx={{ mt: 2 }}> 
    <Typography
      variant="h4" // بزرگ‌تر کردن متن
      component="h1"
      sx={{
        textAlign: 'center', // وسط‌چین کردن
        fontWeight: 'bold', // برجسته کردن متن
      }}
    >
      Add New Teacher
    </Typography>
  </Box>
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
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="First Name"
      variant="outlined"
      value={firstname}
      onChange={(e) => setFirstname(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(firstname), // اگر مقدار موجود باشد، برچسب بالای فیلد می‌رود
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Last Name"
      variant="outlined"
      value={lastname}
      onChange={(e) => setLastname(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(lastname),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="National ID"
      variant="outlined"
      value={nationalid}
      onChange={(e) => setNationalid(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(nationalid),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Phone Number"
      variant="outlined"
      value={phonenumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(phonenumber),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Password"
      type="password"
      variant="outlined"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(password),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Confirm Password"
      type="password"
      variant="outlined"
      value={password2}
      onChange={(e) => setPassword2(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(password2),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Email"
      variant="outlined"
      value={Email}
      onChange={(e) => setEmail(e.target.value)}
      required
      InputLabelProps={{
        shrink: Boolean(Email),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 50,
        },
      }}
    />
  </Grid>
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
      InputLabelProps={{
        shrink: Boolean(address),
      }}
    />
  </Grid>
</Grid>

 

<Box
  sx={{
    display: 'flex',
    justifyContent: 'center', // وسط‌چین کردن دکمه‌ها
    gap: 2, // فاصله یکنواخت بین دکمه‌ها
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
      backgroundColor: '#673AB7',
      color: '#fff',
      ':hover': {
        backgroundColor: '#512DA8',
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

export default SignUpTeacher;
