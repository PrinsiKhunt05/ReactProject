import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Button, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Card, CardContent,
  TextField, Alert, Fade, Grow, useMediaQuery, useTheme, Container, Paper,
} from '@mui/material';
import {
  Menu as MenuIcon, Folder as FolderIcon, Person as PersonIcon,
  Logout as LogoutIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon,
} from '@mui/icons-material';

const ProfilePage = ({ navigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Get current user
  const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser') || 'null');
  const user = getCurrentUser();

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
      return;
    }
    const currentUser = getCurrentUser();
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [navigate]);

  // Update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    
    const currentUser = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], name, email };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user
      const { password, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    const currentUser = getCurrentUser();
    setName(currentUser.name);
    setEmail(currentUser.email);
    setIsEditing(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Drawer content
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <FolderIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="white">
            MyDrive
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, pt: 2 }}>
        <ListItemButton
          onClick={() => navigate('/dashboard')}
          sx={{ mx: 1, borderRadius: 2 }}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="My Files" />
        </ListItemButton>

        <ListItemButton
          selected
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              '&:hover': { bgcolor: 'primary.light' },
            },
            mx: 1,
            borderRadius: 2,
          }}
        >
          <ListItemIcon>
            <PersonIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>

      <Box sx={{ p: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight="600" noWrap>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 280px)` },
          ml: { md: '280px' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Profile Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 280px)` },
          mt: 8,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="md">
          <Grow in timeout={800}>
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 4,
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto 16px',
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    animation: 'bounce 2s infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
              </Box>

              <Box sx={{ p: 4 }}>
                {success && (
                  <Fade in>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {success}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 4 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />

                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5568d3 30%, #6a4191 90%)',
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        sx={{ py: 1.5 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5568d3 30%, #6a4191 90%)',
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;
