import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Folder as FolderIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterPage = ({ navigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const token = "fdIowwXOCAV8Jlum";

  useEffect(() => {
    dataview();
  }, []);

  function dataview() {
    axios.get('https://generateapi.techsnack.online/api/ProjectFair', {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        setList(res.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const DeleteData = (id) => {
    axios.delete(`https://generateapi.techsnack.online/api/ProjectFair/${id}`, {
      headers: {
        Authorization: token
      }
    })
      .then(() => {
        toast.success("Deleted Successfully!");
        dataview();
      })
      .catch((error) => {
        toast.error("Delete Failed!");
      });
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Please enter your name'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Please enter your email'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter your password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Please confirm your password')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);

      const postData = {
        FullName: values.name,
        Email: values.email,
        Password: values.password
      };

      axios.post('https://generateapi.techsnack.online/api/ProjectFair', postData, {
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          toast.success("Registration Successful! Please login.");
          formik.resetForm();
          setIsLoading(false);
          dataview();
          
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Registration Failed!");
          setIsLoading(false);
        });
    }
  });

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
            marginTop: 5,
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

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

        <br /><br />
        <TableContainer component={Paper} sx={{ marginBottom: "30px", width: "600px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>FullName</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                list.map((i) => (
                  <TableRow key={i._id}>
                    <TableCell>{i.FullName}</TableCell>
                    <TableCell>{i.Email}</TableCell>
                    <TableCell>{i.Password}</TableCell>
                    <TableCell>
                      <Button onClick={() => DeleteData(i._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
      </Container>
    </Box>
  );
};

export default RegisterPage;