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
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import { useParent } from '../context/ParentContext';
import ParentClasses from './ParentClasses';
import ParentWallet from '../Wallet&Payments/wallet';

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
  list: {
    width: '95%',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px',
  },
  listItem: {
    borderBottom: '1px solid #ddd',
    padding: '16px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  listItemText: {
    fontWeight: 500,
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
      const response = await fetch('http://127.0.0.1:8000/student/parent-logout/', {
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
    {!isDesktop && (
      <Grid container alignItems="center" sx={{ width: '100%' }}>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <Menu />
          </IconButton>
        </Grid>
        <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" noWrap>
            Parent Dashboard
          </Typography>
        </Grid>
      </Grid>
    )}
    {isDesktop && (
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Parent Dashboard
      </Typography>
    )}
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
    </ThemeProvider>
  );
};

export default ParentDashboard;
