// ============================================
// FILE: src/pages/DashboardPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, TextField, InputAdornment,
  Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar,
  Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent,
  DialogActions, Zoom, Fade, useMediaQuery, useTheme, CircularProgress, Chip,
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, Upload as UploadIcon,
  Folder as FolderIcon, Person as PersonIcon, Logout as LogoutIcon,
  Delete as DeleteIcon, Visibility as VisibilityIcon, Info as InfoIcon,
  Image as ImageIcon, Description as DescriptionIcon, InsertDriveFile as FileIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

const DashboardPage = ({ navigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get current user
  const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser') || 'null');
  const user = getCurrentUser();

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
      return;
    }
    loadFiles();
  }, [navigate]);

  // Load files from localStorage
  const loadFiles = () => {
    const user = getCurrentUser();
    if (!user) return;
    const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
    setFiles(allFiles[user.id] || []);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    const user = getCurrentUser();
    
    let processed = 0;
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          data: event.target.result
        };
        
        // Add file to localStorage
        const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
        if (!allFiles[user.id]) allFiles[user.id] = [];
        allFiles[user.id].push(fileData);
        localStorage.setItem('files', JSON.stringify(allFiles));
        
        processed++;
        if (processed === uploadedFiles.length) {
          loadFiles();
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Delete file
  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const user = getCurrentUser();
      const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
      if (allFiles[user.id]) {
        allFiles[user.id] = allFiles[user.id].filter(f => f.id !== fileId);
        localStorage.setItem('files', JSON.stringify(allFiles));
      }
      loadFiles();
      setDetailsOpen(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Open file in new tab
  const handleOpenInNewTab = (file) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon sx={{ fontSize: 48, color: 'primary.main' }} />;
    if (type === 'application/pdf' || type.includes('text')) 
      return <DescriptionIcon sx={{ fontSize: 48, color: 'error.main' }} />;
    return <FileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />;
  };

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Check if file can be previewed
  const canPreview = (type) => {
    return type.startsWith('image/') || type === 'application/pdf' || type.startsWith('text/');
  };

  // Filter files
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Drawer content
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, background: '#667eea'}}>
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
            <FolderIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="My Files" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate('/profile')}
          sx={{ mx: 1, borderRadius: 2 }}
        >
          <ListItemIcon>
            <PersonIcon />
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

          <TextField
            size="small"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, maxWidth: 600, mr: 2 }}
          />

          <input
            accept="*/*"
            style={{ display: 'none'}}
            id="file-upload"
            multiple
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
              disabled={isUploading}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5568d3 30%, #6a4191 90%)',
                },
              }}
            >
              {isMobile ? '' : 'Upload'}
            </Button>
          </label>
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
        <Fade in timeout={500}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              My Files
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
              {isUploading && <Chip label="Uploading..." size="small" color="primary" sx={{ ml: 2 }} />}
            </Typography>

            {filteredFiles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <FolderIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {searchQuery ? 'No files found' : 'No files yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {filteredFiles.map((file, index) => (
                  <Zoom in timeout={300 + index * 50} key={file.id}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            {getFileIcon(file.type)}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(file.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Typography variant="h6" noWrap gutterBottom title={file.name}>
                            {file.name}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Size: {formatSize(file.size)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </Typography>
                        </CardContent>

                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          {canPreview(file.type) && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<VisibilityIcon />}
                              onClick={() => {
                                setPreviewFile(file);
                                setPreviewOpen(true);
                              }}
                              sx={{ flex: 1, mr: 1 }}
                            >
                              Open
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<InfoIcon />}
                            onClick={() => {
                              setSelectedFile(file);
                              setDetailsOpen(true);
                            }}
                            sx={{ flex: 1 }}
                          >
                            Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Zoom>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      </Box>

      {/* File Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>File Details</DialogTitle>
        <DialogContent dividers>
          {selectedFile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1" fontWeight="600">{selectedFile.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedFile.type}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                <Typography variant="body1">{formatSize(selectedFile.size)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Upload Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedFile.uploadDate).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{previewFile?.name}</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 400 }}>
          {previewFile && (
            <>
              {previewFile.type.startsWith('image/') && (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={previewFile.data}
                    alt={previewFile.name}
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                  />
                </Box>
              )}
              {previewFile.type === 'application/pdf' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DescriptionIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>PDF Document</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click "Open in New Tab" to view this PDF
                  </Typography>
                </Box>
              )}
              {previewFile.type.startsWith('text/') && (
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '70vh',
                  }}
                >
                  {atob(previewFile.data.split(',')[1])}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<OpenInNewIcon />}
            onClick={() => handleOpenInNewTab(previewFile)}
            variant="contained"
          >
            Open in New Tab
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;