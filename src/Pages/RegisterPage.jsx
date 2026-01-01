import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Folder as FolderIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

const RegisterPage = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.find((u) => u.email === email)) {
        setError('Email already exists');
        setIsLoading(false);
        return;
      }

      users.push({
        id: Date.now().toString(),
        name,
        email,
        password,
      });

      localStorage.setItem('users', JSON.stringify(users));
      navigate('/login');
    }, 500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        fontFamily: `'Poppins', sans-serif`,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 3,
            borderRadius: 3,
            width: '100%',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: '#667eea',
                width: 56,
                height: 56,
                margin: '0 auto 10px',
              }}
            >
              <FolderIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register to continue
            </Typography>
          </Box>

          {error && (
            <Fade in>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} />
                ) : (
                  <PersonAddIcon />
                )
              }
              sx={{
                py: 1,
                fontWeight: 600,
                background: '#667eea',
                '&:hover': {
                  background: '#5a6fd6',
                },
              }}
            >
              {isLoading ? 'Creating...' : 'Register'}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2 }}
              color="text.secondary"
            >
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
