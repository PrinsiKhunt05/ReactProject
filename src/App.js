  import React, { useState, useEffect } from 'react';
  import { ThemeProvider, createTheme } from '@mui/material/styles';
  import CssBaseline from '@mui/material/CssBaseline';
  import LoginPage from './Pages/LoginPage';
  import RegisterPage from './Pages/RegisterPage';
  import DashboardPage from './Pages/DashboardPage';
  import ProfilePage from './Pages/ProfilePage';

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  const Router = ({ children }) => {
    const getInitialPath = () => {
      const hash = window.location.hash.slice(1);
      return hash || '/login';
    };
    
    const [currentPath, setCurrentPath] = useState(getInitialPath());
    
    useEffect(() => {
      const handleHashChange = () => {
        const newPath = window.location.hash.slice(1) || '/login';
        setCurrentPath(newPath);
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const navigate = (path) => {
      window.location.hash = path;
      setCurrentPath(path);
    };
    
    return React.Children.map(children, child =>
      React.cloneElement(child, { currentPath, navigate })
    );
  };

  const Route = ({ path, component: Component, currentPath, navigate }) => {
    return currentPath === path ? <Component navigate={navigate} /> : null;
  };

  const App = () => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/profile" component={ProfilePage} />
        </Router>
      </ThemeProvider>
    );
  };

  export default App;
