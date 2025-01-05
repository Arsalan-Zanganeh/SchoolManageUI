import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { VerifiedUser } from '@mui/icons-material'; 
import DisciplinaryStatus from './DisciplinaryStatus';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CssBaseline,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  ExitToApp,
  Menu,
  Class,
  Home as HomeIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  ArrowBack,
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import { useParent } from '../context/ParentContext';
import ParentClasses from './ParentClasses';
import ParentWallet from '../Wallet&Payments/wallet';
import Swal from 'sweetalert2';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const styles = {
  listItem: {
    padding: "16px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  },
  listItemUnread: {
    backgroundColor: "#e3f2fd", // رنگ زمینه آبی کم‌رنگ برای پیام‌های نخوانده
    borderLeft: "4px solid #1976d2", // هایلایت آبی برای پیام‌های نخوانده
    fontWeight: "bold", // برجسته‌تر کردن متن پیام نخوانده
  },
  listItemRead: {
    backgroundColor: "#ffffff", // زمینه سفید برای پیام‌های خوانده‌شده
    color: "#757575", // متن خاکستری کم‌رنگ برای پیام‌های خوانده‌شده
    fontWeight: "normal",
  },
  previewTextUnread: {
    color: "#000", // متن مشکی برای پیام نخوانده
    fontWeight: "bold",
  },
  previewTextRead: {
    color: "#757575", // متن خاکستری برای پیام خوانده‌شده
    fontWeight: "normal",
  },
  dateText: {
    color: "#757575",
    fontSize: "0.9rem",
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#0036AB',
      drawer: '#0051FF',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

const NavigationBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
  width: '200px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ParentDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nofunseen, setcount] = useState(0);
  const { logoutParent } = useParent();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
const [selectedNotification, setSelectedNotification] = useState(null);
// const [nofunseen, setCount] = useState(0); // تعداد پیام‌های دیده‌نشده
const [open, setOpen] = useState(false); 

const fetchUnseenCount = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/notification/unseen_notifications/`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setcount(data.count); 
    }
  } catch (error) {
    console.error("Error fetching unseen notifications count:", error);
  }
};

const fetchNotifications = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/notification/notifications/`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setUnreadNotifications(data);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const markAsSeen = async (id) => {
  try {
    await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/notification/student-single-notif-seen/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
  }
};

useEffect(() => {
  fetchUnseenCount(); // بارگذاری تعداد پیام‌های دیده‌نشده
}, []);
const handleNotificationClick = (notification) => {
  setSelectedNotification(notification);
  if (!notification.seen) {
    markAsSeen(notification.id);
    notification.seen = true;
    setcount((prevCount) => prevCount - 1);
  }
};

const handleBackClick = () => {
  setSelectedNotification(null);
};

const handleClickOpen = () => {
  fetchNotifications(); // بارگذاری لیست پیام‌ها
  setOpen(true); // باز کردن دیالوگ
};

const handleClose = () => {
  setOpen(false); // بستن دیالوگ
};

const createPreview = (message) => {
  const plainText = message.replace(/<[^>]+>/g, ""); // حذف تگ‌های HTML
  return plainText.split(" ").slice(0, 10).join(" ") + "...";
};

const sortedNotifications = [...unreadNotifications].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

  // Load saved tab value from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('parent-dashboard-tab');
    if (savedTab !== null) {
      setTabValue(Number(savedTab));
    }
  }, []);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    // Save the new tab value in localStorage
    localStorage.setItem('parent-dashboard-tab', newValue);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        logoutParent();
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop
    ? { variant: 'permanent', open: true }
    : { open: sidebarOpen, onClose: toggleSidebar };

  const goBack = () => handleTabChange(0);


  // Add these state variables
const [showFeeDialog, setShowFeeDialog] = useState(false);
const [fees, setFees] = useState([]);

// Add these handler functions
const handleFeeDialogOpen = () => {
  fetchFees();
  setShowFeeDialog(true);
};

const handleFeeDialogClose = () => setShowFeeDialog(false);

const fetchFees = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-fee-list/`,
      {
        credentials: 'include',
      }
    );
    if (response.ok) {
      const data = await response.json();
      setFees(data);
    }
  } catch (error) {
    console.error('Error fetching fees:', error);
  }
};

const handlePayFee = async (feeId) => {
  try {
   

    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/parent-pay-fee/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: feeId }),
      }
    );
    
    const data = await response.json();
    
    if (response.ok && data.message !== "Not enough money") {
      setFees(prevFees => 
        prevFees.map(fee => 
          fee.id === feeId 
            ? { ...fee, Is_Paid: 1 }
            : fee
        )
      );
    }
  } catch (error) {
    console.error('Error:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Server error or network issue',
      confirmButtonColor: '#d33',
      customClass: {
        container: 'my-swal-container'
      }
    });
  }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
       <AppBar
  position="fixed"
  sx={{
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
  }}
>
<Toolbar>
    <Grid container alignItems="center" justifyContent="space-between">
      {/* منوی همبرگری در حالت موبایل */}
      {!isDesktop && (
        <Grid item>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <Menu />
          </IconButton>
        </Grid>
      )}
      {/* عنوان داشبورد */}
      <Grid item xs>
        <Typography
          variant="h6"
          noWrap
          sx={{
            textAlign: isDesktop ? 'left' : 'center',
            flexGrow: 1,
          }}
        >
          Parent Dashboard
        </Typography>
      </Grid>
      {/* آیکون زنگوله */}
      <Grid item>
      <IconButton
  edge="end"
  color="inherit"
  onClick={handleClickOpen}
>
  <Badge badgeContent={nofunseen} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>

      </Grid>
    </Grid>
  </Toolbar>
</AppBar>

        <Toolbar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
  anchor="left"
  variant={isDesktop ? "permanent" : "temporary"}
  open={isDesktop || sidebarOpen}
  onClose={toggleSidebar}
  ModalProps={{
    keepMounted: true, 
  }}
  sx={{
    '& .MuiDrawer-paper': {
      bgcolor: theme.palette.primary.drawer,
      color: theme.palette.text.primary,
      minWidth: '14vh', 

      '& .MuiListItemText-primary': { color: '#fff' },
    },
  }}
>
  <Toolbar />
  <List>
  <ListItem
  button
  onClick={() => handleTabChange(0)} 
  sx={{
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      transition: 'background-color 0.3s',
    },
    cursor: 'pointer',
    borderRadius: 1,
    padding: theme.spacing(1),
  }}
>
  <ListItemIcon sx={{ color: '#fff' }}>
    <HomeIcon />
  </ListItemIcon>
  <ListItemText primary="Home" />
</ListItem>
    <ListItem
      button
      onClick={() => {
        handleLogout();
        if (!isDesktop) toggleSidebar();
      }}
      sx={{
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          transition: 'background-color 0.3s',
        },
        cursor: 'pointer',
        borderRadius: 1,
        padding: theme.spacing(1),
      }}
    >
      <ListItemIcon sx={{ color: '#fff' }}>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </List>
</Drawer>
          <Box component="main" sx={{ flexGrow: 1, mt: 4 }}>
            <Container maxWidth="lg">
              <TabPanel value={tabValue} index={0}>
              <Typography
  variant="h4"
  sx={{
    fontWeight: "bold", // ضخیم‌تر کردن متن
    fontSize: { xs: "1.5rem", sm: "2rem" }, // اندازه فونت برای موبایل و دسکتاپ
    textAlign: "center", // متن وسط‌چین
    mt: 2, // فاصله از بالا
    mb: 3, // فاصله از پایین
  }}
>
  Welcome to the Parent Dashboard!
</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavigationBox elevation={3} onClick={() => handleTabChange(2)}>
                      <VerifiedUser fontSize="large" />
                      <Typography variant="subtitle1">Disciplinary Status</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavigationBox elevation={3} onClick={() => handleTabChange(1)}>
                      <Class fontSize="large" />
                      <Typography variant="subtitle1">Classes</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavigationBox elevation={3} onClick={() => handleTabChange(3)}>
                      <WalletIcon fontSize="large" />
                      <Typography variant="subtitle1">Wallet</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavigationBox elevation={3} onClick={handleLogout}>
                      <ExitToApp fontSize="large" />
                      <Typography variant="subtitle1">Logout</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavigationBox elevation={3} onClick={handleFeeDialogOpen}>
                      <PaymentIcon fontSize="large" />
                      <Typography variant="subtitle1">Fees</Typography>
                    </NavigationBox>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ParentClasses goBack={goBack} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <DisciplinaryStatus goBack={goBack} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <ParentWallet goBack={goBack} />
              </TabPanel>
            </Container>
          </Box>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
    Notifications
  </DialogTitle>
  <DialogContent>
    {selectedNotification ? (
      <Box>
        {/* دکمه BACK در بالا و سمت چپ */}
        <Button
          onClick={handleBackClick}
          style={{
            color: '#1976d2',
            textTransform: 'none',
            marginBottom: '16px',
          }}
        >
          Back
        </Button>

        {/* محتوای پیام */}
        <div
          style={{ marginBottom: '16px', fontSize: '1rem' }}
          dangerouslySetInnerHTML={{
            __html: selectedNotification.message,
          }}
        />

        {/* تاریخ پیام */}
        <Typography
          variant="body2"
          style={{
            color: '#757575',
            fontSize: '0.9rem',
            textAlign: 'left',
          }}
        >
          {new Date(selectedNotification.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </Typography>
      </Box>
    ) : (
      <List style={{ maxHeight: "400px", overflow: "auto" }}>
  {sortedNotifications.map((notification) => (
    <ListItem
      key={notification.id}
      button
      onClick={() => handleNotificationClick(notification)}
      style={
        notification.seen ? styles.listItemRead : styles.listItemUnread
      }
    >
      <ListItemText
        primary={
          <Typography
            style={
              notification.seen
                ? styles.previewTextRead
                : styles.previewTextUnread
            }
          >
            {createPreview(notification.message)}
          </Typography>
        }
        secondary={
          <Typography style={styles.dateText}>
            {new Date(notification.date).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Typography>
        }
      />
    </ListItem>
  ))}
</List>

    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} style={{ color: '#1976d2' }}>
      Close
    </Button>
  </DialogActions>
</Dialog>
// Add this Dialog component before the closing ThemeProvider tag
<Dialog
  open={showFeeDialog}
  onClose={handleFeeDialogClose}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ 
    bgcolor: theme.palette.primary.main, 
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    Fee Management
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleFeeDialogClose}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ mt: 2 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fee List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.Year}</TableCell>
                    <TableCell>{fee.Month}</TableCell>
                    <TableCell>
                      ${fee.Amount}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={fee.Is_Paid ? "Paid" : "Unpaid"}
                        color={fee.Is_Paid ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      {!fee.Is_Paid && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handlePayFee(fee.id)}
                          startIcon={<PaymentIcon />}
                        >
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </DialogContent>
</Dialog>

    </ThemeProvider>
  );
};

export default ParentDashboard;
