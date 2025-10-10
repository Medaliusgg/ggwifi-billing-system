import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { settingsAPI } from '../services/api';

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: false,
    securityLevel: 'medium',
    theme: 'light',
    language: 'en',
  });

  const loadSettings = useCallback(async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load settings', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSystem = async () => {
    try {
      await settingsAPI.updateSystem(systemSettings);
      enqueueSnackbar('System settings saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save system settings', { variant: 'error' });
    }
  };

  const handleSaveRadius = async () => {
    try {
      await settingsAPI.updateRadius(radiusSettings);
      enqueueSnackbar('RADIUS settings saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save RADIUS settings', { variant: 'error' });
    }
  };

  const handleSaveMikrotik = async () => {
    try {
      await settingsAPI.updateMikrotik(mikrotikSettings);
      enqueueSnackbar('MikroTik settings saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save MikroTik settings', { variant: 'error' });
    }
  };

  const handleSavePayment = async () => {
    try {
      await settingsAPI.updatePayment(paymentSettings);
      enqueueSnackbar('Payment settings saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save payment settings', { variant: 'error' });
    }
  };

  const SystemSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            System Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={systemSettings.companyName || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="System URL"
                value={systemSettings.systemUrl || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, systemUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Support Email"
                type="email"
                value={systemSettings.supportEmail || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Support Phone"
                value={systemSettings.supportPhone || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, supportPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={systemSettings.sessionTimeout || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={systemSettings.maxLoginAttempts || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, maxLoginAttempts: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.maintenanceMode || false}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.debugMode || false}
                    onChange={(e) => setSystemSettings({ ...systemSettings, debugMode: e.target.checked })}
                  />
                }
                label="Debug Mode"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSystem}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Save System Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const RadiusSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            RADIUS Server Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RADIUS Host"
                value={radiusSettings.host || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, host: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RADIUS Port"
                type="number"
                value={radiusSettings.port || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, port: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RADIUS Secret"
                type="password"
                value={radiusSettings.secret || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, secret: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Accounting Port"
                type="number"
                value={radiusSettings.accountingPort || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, accountingPort: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NAS Identifier"
                value={radiusSettings.nasIdentifier || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, nasIdentifier: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timeout (seconds)"
                type="number"
                value={radiusSettings.timeout || ''}
                onChange={(e) => setRadiusSettings({ ...radiusSettings, timeout: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={radiusSettings.enabled || false}
                    onChange={(e) => setRadiusSettings({ ...radiusSettings, enabled: e.target.checked })}
                  />
                }
                label="Enable RADIUS Authentication"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveRadius}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Save RADIUS Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const MikrotikSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            MikroTik Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Username"
                value={mikrotikSettings.defaultUsername || ''}
                onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, defaultUsername: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Port"
                type="number"
                value={mikrotikSettings.defaultPort || ''}
                onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, defaultPort: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Timeout (ms)"
                type="number"
                value={mikrotikSettings.apiTimeout || ''}
                onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, apiTimeout: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session Timeout (seconds)"
                type="number"
                value={mikrotikSettings.sessionTimeout || ''}
                onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, sessionTimeout: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mikrotikSettings.autoDiscovery || false}
                    onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, autoDiscovery: e.target.checked })}
                  />
                }
                label="Auto Discovery"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mikrotikSettings.sslEnabled || false}
                    onChange={(e) => setMikrotikSettings({ ...mikrotikSettings, sslEnabled: e.target.checked })}
                  />
                }
                label="Enable SSL"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveMikrotik}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Save MikroTik Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PaymentSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Payment Gateway Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SELCOM API Key"
                value={paymentSettings.selcomApiKey || ''}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, selcomApiKey: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SELCOM API Secret"
                type="password"
                value={paymentSettings.selcomApiSecret || ''}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, selcomApiSecret: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SELCOM Base URL"
                value={paymentSettings.selcomBaseUrl || ''}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, selcomBaseUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Currency"
                value={paymentSettings.currency || ''}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.selcomEnabled || false}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, selcomEnabled: e.target.checked })}
                  />
                }
                label="Enable SELCOM Payment"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.testMode || false}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, testMode: e.target.checked })}
                  />
                }
                label="Test Mode"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSavePayment}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Save Payment Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure system parameters, RADIUS, MikroTik, and payment settings
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="System" icon={<SettingsIcon />} />
          <Tab label="RADIUS" icon={<SecurityIcon />} />
          <Tab label="MikroTik" icon={<RouterIcon />} />
          <Tab label="Payment" icon={<PaymentIcon />} />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {tabValue === 0 && <SystemSettingsTab />}
      {tabValue === 1 && <RadiusSettingsTab />}
      {tabValue === 2 && <MikrotikSettingsTab />}
      {tabValue === 3 && <PaymentSettingsTab />}
    </Box>
  );
};

export default Settings; 