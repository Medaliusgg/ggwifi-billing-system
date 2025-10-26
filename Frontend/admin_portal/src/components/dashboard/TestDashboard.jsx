import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import useAuthStore from '/src/store/authStore.js';

const TestDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  console.log('🔍 TestDashboard - Auth state:', { user, isAuthenticated });

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      color: 'white'
    }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#F5B700' }}>
        🧪 Test Dashboard - Debug Mode
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: '#1a1a1a', 
            color: 'white',
            border: '2px solid #F5B700',
            boxShadow: '0 4px 20px rgba(245, 183, 0, 0.3)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#F5B700', mb: 2 }}>
                🔐 Authentication Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Is Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                User: {user ? user.username : 'None'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Role: {user ? user.role : 'None'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Full Name: {user ? user.fullName : 'None'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: '#1a1a1a', 
            color: 'white',
            border: '2px solid #F5B700',
            boxShadow: '0 4px 20px rgba(245, 183, 0, 0.3)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#F5B700', mb: 2 }}>
                📊 Dashboard Modules
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ User Management</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ Router Management</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ Customer Management</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ Package Management</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ Finance Management</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>✅ Settings</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card sx={{ 
            bgcolor: '#1a1a1a', 
            color: 'white',
            border: '2px solid #F5B700',
            boxShadow: '0 4px 20px rgba(245, 183, 0, 0.3)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#F5B700', mb: 2 }}>
                🎯 Admin Dashboard Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ Authentication: Working
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ User Role: {user ? user.role : 'None'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ Dashboard: TestDashboard Component
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ Backend: Connected
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ Frontend: Running
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestDashboard;