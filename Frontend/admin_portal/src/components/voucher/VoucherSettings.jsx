import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tabs,
  Tab,
  Slider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Settings,
  Upload,
  Delete,
  Save,
  Refresh,
  Add,
  Edit,
  Visibility,
  Download,
  Palette,
  TextFields,
  Image,
  Print,
  QrCode,
  FormatSize,
  BorderAll,
  Margin,
  Pageview,
  ContentCopy,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  CloudUpload,
  DeleteOutline,
  PhotoCamera,
  AspectRatio,
  TextFormat,
  ColorLens,
  Straighten,
  VerticalAlignCenter,
  HorizontalRule
} from '@mui/icons-material';
import apiClient from '/src/api/client.js';

const VoucherSettings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [previewDialog, setPreviewDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({
    paperSizes: [],
    orientations: [],
    printQualities: [],
    fontFamilies: [],
    logoPositions: [],
    qrPositions: []
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/voucher-settings/active');
      if (response.status === 'success') {
        setSettings(response.data);
        if (response.data.logoUrl) {
          setLogoPreview(response.data.logoUrl);
        }
      }
    } catch (error) {
      console.error('Failed to fetch voucher settings:', error);
      showSnackbar('Failed to fetch voucher settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableOptions = async () => {
    try {
      const [paperSizes, orientations, printQualities, fontFamilies, logoPositions, qrPositions] = await Promise.all([
        apiClient.get('/voucher-settings/paper-sizes'),
        apiClient.get('/voucher-settings/orientations'),
        apiClient.get('/voucher-settings/print-qualities'),
        apiClient.get('/voucher-settings/font-families'),
        apiClient.get('/voucher-settings/logo-positions'),
        apiClient.get('/voucher-settings/qr-positions')
      ]);

      setAvailableOptions({
        paperSizes: paperSizes.status === 'success' ? paperSizes.data : [],
        orientations: orientations.status === 'success' ? orientations.data : [],
        printQualities: printQualities.status === 'success' ? printQualities.data : [],
        fontFamilies: fontFamilies.status === 'success' ? fontFamilies.data : [],
        logoPositions: logoPositions.status === 'success' ? logoPositions.data : [],
        qrPositions: qrPositions.status === 'success' ? qrPositions.data : []
      });
    } catch (error) {
      console.error('Failed to fetch available options:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchAvailableOptions();
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put(`/voucher-settings/${settings.id}`, settings);
      if (response.status === 'success') {
        showSnackbar('Voucher settings saved successfully', 'success');
        fetchSettings();
      }
    } catch (error) {
      console.error('Failed to save voucher settings:', error);
      showSnackbar('Failed to save voucher settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      showSnackbar('Please select a logo file', 'warning');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', logoFile);

      const response = await apiClient.post('/voucher-settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 'success') {
        const logoUrl = response.data.logoUrl;
        handleInputChange('logoUrl', logoUrl);
        setLogoPreview(logoUrl);
        setUploadDialog(false);
        setLogoFile(null);
        showSnackbar('Logo uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      showSnackbar('Failed to upload logo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!settings.logoUrl) return;

    try {
      setSaving(true);
      await apiClient.delete('/voucher-settings/delete-logo', {
        params: { logoUrl: settings.logoUrl }
      });

      handleInputChange('logoUrl', null);
      setLogoPreview(null);
      showSnackbar('Logo deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete logo:', error);
      showSnackbar('Failed to delete logo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const response = await apiClient.post(`/voucher-settings/${settings.id}/reset`);
      if (response.status === 'success') {
        setSettings(response.data);
        showSnackbar('Settings reset to default successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showSnackbar('Failed to reset settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { label: 'General', icon: Settings },
    { label: 'Company Info', icon: TextFields },
    { label: 'Logo & Branding', icon: Image },
    { label: 'Text Content', icon: TextFormat },
    { label: 'Typography', icon: FormatSize },
    { label: 'Layout & Design', icon: Palette },
    { label: 'Print Settings', icon: Print },
    { label: 'Preview', icon: Pageview }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">No voucher settings found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Voucher Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure voucher appearance, printing, and branding
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSettings}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
            disabled={saving}
            color="warning"
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>

      {/* Settings Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={<tab.icon />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* Tab Content */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* General Settings */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Prefix"
                  value={settings.voucherPrefix}
                  onChange={(e) => handleInputChange('voucherPrefix', e.target.value)}
                  helperText="Prefix for generated voucher codes (e.g., GG, VIP)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Code Length"
                  type="number"
                  value={settings.voucherCodeLength}
                  onChange={(e) => handleInputChange('voucherCodeLength', parseInt(e.target.value))}
                  helperText="Total length of voucher codes (including prefix)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Width (mm)"
                  type="number"
                  value={settings.voucherWidth}
                  onChange={(e) => handleInputChange('voucherWidth', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Height (mm)"
                  type="number"
                  value={settings.voucherHeight}
                  onChange={(e) => handleInputChange('voucherHeight', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          )}

          {/* Company Info */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Phone"
                  value={settings.companyPhone || ''}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Email"
                  type="email"
                  value={settings.companyEmail || ''}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Website"
                  value={settings.companyWebsite || ''}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Address"
                  multiline
                  rows={3}
                  value={settings.companyAddress || ''}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Logo & Branding */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Logo Upload
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Button
                        variant="contained"
                        startIcon={<Upload />}
                        onClick={() => setUploadDialog(true)}
                      >
                        Upload Logo
                      </Button>
                      {settings.logoUrl && (
                        <Button
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={handleLogoDelete}
                          color="error"
                        >
                          Remove Logo
                        </Button>
                      )}
                    </Box>
                    {logoPreview && (
                      <Box textAlign="center" mt={2}>
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '100px',
                            objectFit: 'contain',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Logo Width (px)"
                  type="number"
                  value={settings.logoWidth}
                  onChange={(e) => handleInputChange('logoWidth', parseInt(e.target.value))}
                />
                <TextField
                  fullWidth
                  label="Logo Height (px)"
                  type="number"
                  value={settings.logoHeight}
                  onChange={(e) => handleInputChange('logoHeight', parseInt(e.target.value))}
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Logo Position</InputLabel>
                  <Select
                    value={settings.logoPosition}
                    onChange={(e) => handleInputChange('logoPosition', e.target.value)}
                    label="Logo Position"
                  >
                    {availableOptions.logoPositions.map((position) => (
                      <MenuItem key={position} value={position}>
                        {position.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Text Content */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Header Text"
                  multiline
                  rows={2}
                  value={settings.headerText}
                  onChange={(e) => handleInputChange('headerText', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Footer Text"
                  multiline
                  rows={2}
                  value={settings.footerText}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions Text"
                  multiline
                  rows={4}
                  value={settings.instructionsText}
                  onChange={(e) => handleInputChange('instructionsText', e.target.value)}
                  helperText="Use \\n for line breaks"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Terms & Conditions"
                  multiline
                  rows={3}
                  value={settings.termsText}
                  onChange={(e) => handleInputChange('termsText', e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Typography */}
          {activeTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={settings.fontFamily}
                    onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                    label="Font Family"
                  >
                    {availableOptions.fontFamilies.map((font) => (
                      <MenuItem key={font} value={font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Line Spacing"
                  type="number"
                  step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => handleInputChange('lineSpacing', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Header Font Size"
                  type="number"
                  value={settings.headerFontSize}
                  onChange={(e) => handleInputChange('headerFontSize', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Body Font Size"
                  type="number"
                  value={settings.bodyFontSize}
                  onChange={(e) => handleInputChange('bodyFontSize', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Footer Font Size"
                  type="number"
                  value={settings.footerFontSize}
                  onChange={(e) => handleInputChange('footerFontSize', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Voucher Code Font Size"
                  type="number"
                  value={settings.voucherCodeFontSize}
                  onChange={(e) => handleInputChange('voucherCodeFontSize', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          )}

          {/* Layout & Design */}
          {activeTab === 5 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Text Color"
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Header Color"
                  type="color"
                  value={settings.headerColor}
                  onChange={(e) => handleInputChange('headerColor', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Code Color"
                  type="color"
                  value={settings.voucherCodeColor}
                  onChange={(e) => handleInputChange('voucherCodeColor', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Border Color"
                  type="color"
                  value={settings.borderColor}
                  onChange={(e) => handleInputChange('borderColor', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Border Width (px)"
                  type="number"
                  value={settings.borderWidth}
                  onChange={(e) => handleInputChange('borderWidth', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Margin Top (mm)"
                  type="number"
                  value={settings.marginTop}
                  onChange={(e) => handleInputChange('marginTop', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Margin Bottom (mm)"
                  type="number"
                  value={settings.marginBottom}
                  onChange={(e) => handleInputChange('marginBottom', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Margin Left (mm)"
                  type="number"
                  value={settings.marginLeft}
                  onChange={(e) => handleInputChange('marginLeft', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Margin Right (mm)"
                  type="number"
                  value={settings.marginRight}
                  onChange={(e) => handleInputChange('marginRight', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          )}

          {/* Print Settings */}
          {activeTab === 6 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Paper Size</InputLabel>
                  <Select
                    value={settings.paperSize}
                    onChange={(e) => handleInputChange('paperSize', e.target.value)}
                    label="Paper Size"
                  >
                    {availableOptions.paperSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Page Orientation</InputLabel>
                  <Select
                    value={settings.pageOrientation}
                    onChange={(e) => handleInputChange('pageOrientation', e.target.value)}
                    label="Page Orientation"
                  >
                    {availableOptions.orientations.map((orientation) => (
                      <MenuItem key={orientation} value={orientation}>
                        {orientation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Print Quality</InputLabel>
                  <Select
                    value={settings.printQuality}
                    onChange={(e) => handleInputChange('printQuality', e.target.value)}
                    label="Print Quality"
                  >
                    {availableOptions.printQualities.map((quality) => (
                      <MenuItem key={quality} value={quality}>
                        {quality}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Print Copies"
                  type="number"
                  value={settings.printCopies}
                  onChange={(e) => handleInputChange('printCopies', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Printer"
                  value={settings.defaultPrinter || ''}
                  onChange={(e) => handleInputChange('defaultPrinter', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoPrint}
                      onChange={(e) => handleInputChange('autoPrint', e.target.checked)}
                    />
                  }
                  label="Auto Print"
                />
              </Grid>
            </Grid>
          )}

          {/* Display Options */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6">Display Options</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showQrCode}
                    onChange={(e) => handleInputChange('showQrCode', e.target.checked)}
                  />
                }
                label="Show QR Code"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showExpiryDate}
                    onChange={(e) => handleInputChange('showExpiryDate', e.target.checked)}
                  />
                }
                label="Show Expiry Date"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showGenerationDate}
                    onChange={(e) => handleInputChange('showGenerationDate', e.target.checked)}
                  />
                }
                label="Show Generation Date"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showPackageDetails}
                    onChange={(e) => handleInputChange('showPackageDetails', e.target.checked)}
                  />
                }
                label="Show Package Details"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showAmount}
                    onChange={(e) => handleInputChange('showAmount', e.target.checked)}
                  />
                }
                label="Show Amount"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showDuration}
                    onChange={(e) => handleInputChange('showDuration', e.target.checked)}
                  />
                }
                label="Show Duration"
              />
            </Grid>
          </Grid>

          {/* QR Code Settings */}
          {settings.showQrCode && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="h6">QR Code Settings</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="QR Code Size (px)"
                  type="number"
                  value={settings.qrCodeSize}
                  onChange={(e) => handleInputChange('qrCodeSize', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>QR Code Position</InputLabel>
                  <Select
                    value={settings.qrCodePosition}
                    onChange={(e) => handleInputChange('qrCodePosition', e.target.value)}
                    label="QR Code Position"
                  >
                    {availableOptions.qrPositions.map((position) => (
                      <MenuItem key={position} value={position}>
                        {position.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Preview Tab */}
          {activeTab === 7 && (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Voucher Preview
              </Typography>
              <Paper
                sx={{
                  width: '210mm',
                  height: '297mm',
                  margin: '0 auto',
                  backgroundColor: settings.backgroundColor,
                  color: settings.textColor,
                  border: `${settings.borderWidth}px solid ${settings.borderColor}`,
                  position: 'relative',
                  transform: 'scale(0.5)',
                  transformOrigin: 'top center',
                  mb: 4
                }}
              >
                {/* Voucher Preview Content */}
                <Box sx={{ p: 2 }}>
                  {logoPreview && (
                    <Box textAlign="center" mb={2}>
                      <img
                        src={logoPreview}
                        alt="Logo"
                        style={{
                          width: settings.logoWidth,
                          height: settings.logoHeight,
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  )}
                  
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: 'center',
                      color: settings.headerColor,
                      fontSize: settings.headerFontSize,
                      fontFamily: settings.fontFamily,
                      mb: 2
                    }}
                  >
                    {settings.headerText}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: settings.voucherCodeFontSize,
                      fontFamily: settings.fontFamily,
                      textAlign: 'center',
                      color: settings.voucherCodeColor,
                      mb: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    GG123456789
                  </Typography>

                  {settings.showPackageDetails && (
                    <Box mb={2}>
                      <Typography sx={{ fontSize: settings.bodyFontSize, fontFamily: settings.fontFamily }}>
                        Package: Daily 1GB
                      </Typography>
                      {settings.showDuration && (
                        <Typography sx={{ fontSize: settings.bodyFontSize, fontFamily: settings.fontFamily }}>
                          Duration: 24 hours
                        </Typography>
                      )}
                      {settings.showAmount && (
                        <Typography sx={{ fontSize: settings.bodyFontSize, fontFamily: settings.fontFamily }}>
                          Amount: TZS 5,000
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Typography
                    sx={{
                      fontSize: settings.bodyFontSize,
                      fontFamily: settings.fontFamily,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {settings.instructionsText}
                  </Typography>

                  {settings.showQrCode && (
                    <Box textAlign="center" mt={2}>
                      <Box
                        sx={{
                          width: settings.qrCodeSize,
                          height: settings.qrCodeSize,
                          backgroundColor: '#000',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        QR
                      </Box>
                    </Box>
                  )}

                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      right: 10,
                      fontSize: settings.footerFontSize,
                      fontFamily: settings.fontFamily,
                      textAlign: 'center'
                    }}
                  >
                    {settings.footerText}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Logo Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Logo</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={3}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button variant="contained" component="span" startIcon={<Upload />}>
                Select Logo File
              </Button>
            </label>
            {logoPreview && (
              <Box mt={2}>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '100px',
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Supported formats: JPEG, PNG, GIF. Recommended size: 200x100px
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleLogoUpload} variant="contained" disabled={!logoFile}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoucherSettings;
