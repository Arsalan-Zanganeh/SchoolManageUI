import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

const ParentWallet = ({ goBack }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);

  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/student/parent-view-wallet/', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch wallet balance',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleChargeWallet = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount',
      });
      return;
    }

    setIsCharging(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/student/parent-chargewallet/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(amount)
        }),
      });

      if (response.ok) {
        setOpenDialog(false);
        setAmount('');
        await fetchBalance(); // Refresh balance
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Wallet charged successfully!',
        });
      } else {
        throw new Error('Failed to charge wallet');
      }
    } catch (error) {
      console.error('Error charging wallet:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to charge wallet',
      });
    } finally {
      setIsCharging(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Button
        onClick={goBack}
        variant="outlined"
        sx={{ mb: 3 }}
        startIcon={<WalletIcon />}
      >
        Back to Dashboard
      </Button>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2
        }}
      >
        <WalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Wallet Balance
        </Typography>

        {isLoading ? (
          <CircularProgress sx={{ my: 3 }} />
        ) : (
          <Typography 
            variant="h3" 
            sx={{ 
              my: 3, 
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            ${balance}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenDialog(true)}
          sx={{ mt: 2 }}
        >
          Charge Wallet
        </Button>
      </Paper>

      {/* Charge Dialog */}
      <Dialog open={openDialog} onClose={() => !isCharging && setOpenDialog(false)}>
        <DialogTitle>Charge Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isCharging}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isCharging}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChargeWallet} 
            variant="contained"
            disabled={isCharging}
          >
            {isCharging ? <CircularProgress size={24} /> : 'Charge'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentWallet;