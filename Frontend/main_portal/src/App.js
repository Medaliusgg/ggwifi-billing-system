import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              GGNetworks
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Leading Internet Service Provider in Tanzania
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Welcome to the main portal. This is the public-facing website for GGNetworks.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Port 3002 - Main Portal (Public Website)
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}

export default App; 