import React, { useState, useEffect } from 'react';
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
import { Folder as FolderIcon, Login as LoginIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = "fdIowwXOCAV8Jlum";

  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    axios.get('https://generateapi.techsnack.online/api/ProjectFair', {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      const users = res.data.Data;
      const user = users.find(
        (u) => u.Email === email && u.Password === password
      );

      if (user) {
        const { Password, ...userWithoutPassword } = user;
        localStorage.setItem(
          'currentUser',
          JSON.stringify(userWithoutPassword)
        );
        toast.success("Login Successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Invalid email or password');
        toast.error("Invalid email or password");
        setIsLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
      setError('Login failed. Please try again.');
      toast.error("Login Failed!");
      setIsLoading(false);
    });
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
              DocVault
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your account
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
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={18} /> : <LoginIcon />
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
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2 }}
              color="text.secondary"
            >
              Don't have an account?{' '}
              <Button
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Register
              </Button>
            </Typography>
          </Box>
        </Paper>
        <ToastContainer />
      </Container>
    </Box>     
  );
};

export default LoginPage;