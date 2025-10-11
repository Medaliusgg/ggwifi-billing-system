import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import apiClient from '@/api/client';

const BackendTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const runTest = async (testName, endpoint, method = 'GET', data = null) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    setError('');
    
    try {
      let response;
      if (method === 'POST') {
        response = await apiClient.post(endpoint, data);
      } else {
        response = await apiClient.get(endpoint);
      }
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'success',
          data: response.data,
          statusCode: response.status
        }
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          error: err.response?.data || err.message,
          statusCode: err.response?.status
        }
      }));
      setError(`${testName} failed: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET'
    },
    {
      name: 'Test Endpoint',
      endpoint: '/test',
      method: 'GET'
    },
    {
      name: 'Login Test',
      endpoint: '/auth/login',
      method: 'POST',
      data: { username: 'admin', password: 'admin123' }
    },
    {
      name: 'Packages Test',
      endpoint: '/packages',
      method: 'GET'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Test the connection to your Spring Boot backend running on VPS
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tests.map((test) => (
          <Card key={test.name} sx={{ minWidth: 275 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="div">
                  {test.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => runTest(test.name, test.endpoint, test.method, test.data)}
                  disabled={loading[test.name]}
                  size="small"
                >
                  {loading[test.name] ? <CircularProgress size={20} /> : 'Test'}
                </Button>
              </Box>

              {testResults[test.name] && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status Code: {testResults[test.name].statusCode}
                  </Typography>
                  
                  {testResults[test.name].status === 'success' ? (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      ✅ Success
                    </Alert>
                  ) : (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      ❌ Error
                    </Alert>
                  )}

                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    maxHeight: 300
                  }}>
                    <pre>
                      {JSON.stringify(testResults[test.name].data || testResults[test.name].error, null, 2)}
                    </pre>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ mt: 3, bgcolor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backend Information
          </Typography>
          <Typography variant="body2">
            <strong>Backend URL:</strong> http://ggwifiapp.medaliusggg.xyz:8080/api/v1
          </Typography>
          <Typography variant="body2">
            <strong>Context Path:</strong> /api/v1
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {Object.keys(testResults).length > 0 ? 'Tested' : 'Not Tested'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BackendTest;
