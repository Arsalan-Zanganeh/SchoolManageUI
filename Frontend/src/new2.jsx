import React, { useState } from 'react';
import { Box, Button, TextField, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isEditMode, setEditMode] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150'); // Replace with actual URL
  const [fullName, setFullName] = useState('John Doe');
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [email, setEmail] = useState('john.doe@example.com'); // New email field
  const [bio, setBio] = useState('This is a sample bio.');

  const [backupProfilePicture, setBackupProfilePicture] = useState('');
  const [backupFullName, setBackupFullName] = useState('');
  const [backupPhoneNumber, setBackupPhoneNumber] = useState('');
  const [backupEmail, setBackupEmail] = useState(''); // Backup for email
  const [backupBio, setBackupBio] = useState('');

  const handleEditToggle = () => {
    if (isEditMode) {
      setBackupProfilePicture('');
      setBackupFullName('');
      setBackupPhoneNumber('');
      setBackupEmail('');
      setBackupBio('');
    } else {
      setBackupProfilePicture(profilePicture);
      setBackupFullName(fullName);
      setBackupPhoneNumber(phoneNumber);
      setBackupEmail(email);
      setBackupBio(bio);
    }
    setEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    setProfilePicture(backupProfilePicture);
    setFullName(backupFullName);
    setPhoneNumber(backupPhoneNumber);
    setEmail(backupEmail);
    setBio(backupBio);
    setEditMode(false);
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  const handleSave = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = (confirm) => {
    setConfirmationDialogOpen(false);
    if (confirm) {
      setEditMode(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f4ff">
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        overflow="hidden"
        width={isMobile ? '98%' : 'auto'}
      >
        <Box bgcolor="#1e3a8a" p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Avatar src={profilePicture} sx={{ width: 150, height: 150, borderRadius: '50%' }} />
          {isEditMode && (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-photo"
                type="file"
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="upload-photo">
                <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
                  Upload
                </Button>
              </label>
            </>
          )}
        </Box>
        <Box p={4} bgcolor="#e0e7ff" display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={fullName}
              slotProps={{
                input: {
                  readOnly: !isEditMode,
                  style: {
                    backgroundColor: isEditMode ? 'white' : '#f0f0f0',
                    color: isEditMode ? 'black' : '#7d7d7d'
                  }
                }
              }}
              onChange={(e) => setFullName(e.target.value)}
              InputLabelProps={{ style: { color: '#1e3a8a' } }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              slotProps={{
                input: {
                  readOnly: !isEditMode,
                  style: {
                    backgroundColor: isEditMode ? 'white' : '#f0f0f0',
                    color: isEditMode ? 'black' : '#7d7d7d'
                  }
                }
              }}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputLabelProps={{ style: { color: '#1e3a8a' } }}
            />
            <TextField
              label="Email Address" // New email field label
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              slotProps={{
                input: {
                  readOnly: !isEditMode,
                  style: {
                    backgroundColor: isEditMode ? 'white' : '#f0f0f0',
                    color: isEditMode ? 'black' : '#7d7d7d'
                  }
                }
              }}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#1e3a8a' } }}
            />
            <TextField
              label="Bio"
              variant="outlined"
              fullWidth
              margin="normal"
              value={bio}
              slotProps={{
                input: {
                  readOnly: !isEditMode,
                  style: {
                    backgroundColor: isEditMode ? 'white' : '#f0f0f0',
                    color: isEditMode ? 'black' : '#7d7d7d'
                  }
                }
              }}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={4}
              InputLabelProps={{ style: { color: '#1e3a8a' } }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            {isEditMode ? (
              <>
                <Button variant="outlined" color="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
                <Button variant="outlined" color="primary" onClick={handlePasswordDialogOpen}>
                  Change Password
                </Button>
                <Button variant="outlined" color="primary">
                  Back To Dashboard
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={isPasswordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmationDialogOpen} onClose={() => handleConfirmationDialogClose(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Box>
            Are you sure you want to save the changes?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationDialogClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmationDialogClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;