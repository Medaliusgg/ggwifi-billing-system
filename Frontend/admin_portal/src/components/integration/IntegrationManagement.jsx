import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Badge,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TestTube as TestIcon,
  Power as PowerIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Sms as SmsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const IntegrationManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [smsGateways, setSmsGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('payment'); // 'payment' or 'sms'
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [statistics, setStatistics] = useState({});
  const [testResults, setTestResults] = useState({});

  // Form states
  const [formData, setFormData] = useState({
    gatewayName: '',
    gatewayType: '',
    status: 'INACTIVE',
    isDefault: false,
    isTestMode: true,
    baseUrl: '',
    apiKey: '',
    secretKey: '',
    description: '',
    // Payment Gateway specific
    processingFeeRate: 0.025,
    processingFeeFixed: 0.0,
    minAmount: 100.0,
    maxAmount: 1000000.0,
    supportedCurrencies: 'TZS,USD',
    supportedPaymentMethods: 'MOBILE_MONEY,CREDIT_CARD',
    supportedMobileNetworks: 'MPESA,TIGO_PESA,AIRTEL_MONEY,HALOPESA',
    autoApproveEnabled: false,
    autoApproveAmountThreshold: 10000.0,
    fraudCheckEnabled: true,
    refundEnabled: true,
    settlementEnabled: true,
    settlementFrequency: 'DAILY',
    // SMS Gateway specific
    senderId: 'GGWiFi',
    costPerSms: 0.075,
    maxMessageLength: 160,
    unicodeSupport: true,
    deliveryReportsEnabled: true,
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    rateLimitPerDay: 10000,
    bulkSmsEnabled: true,
    bulkSmsMaxRecipients: 1000,
    templateSmsEnabled: true,
    twoWaySmsEnabled: false,
    allowedCountries: 'TZ,KE,UG,RW'
  });

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    setLoading(true);
    try {
      const [paymentResponse, smsResponse, statsResponse] = await Promise.all([
        fetch('/api/v1/integration/payment-gateways'),
        fetch('/api/v1/integration/sms-gateways'),
        fetch('/api/v1/integration/statistics')
      ]);

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        setPaymentGateways(paymentData.data || []);
      }

      if (smsResponse.ok) {
        const smsData = await smsResponse.json();
        setSmsGateways(smsData.data || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data || {});
      }
    } catch (error) {
      console.error('Failed to fetch integration data:', error);
      showSnackbar('Failed to fetch integration data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, mode, gateway = null) => {
    setDialogType(type);
    setDialogMode(mode);
    setSelectedGateway(gateway);
    
    if (mode === 'edit' && gateway) {
      setFormData({
        ...gateway,
        supportedCurrencies: gateway.supportedCurrencies || 'TZS,USD',
        supportedPaymentMethods: gateway.supportedPaymentMethods || 'MOBILE_MONEY,CREDIT_CARD',
        supportedMobileNetworks: gateway.supportedMobileNetworks || 'MPESA,TIGO_PESA,AIRTEL_MONEY,HALOPESA',
        allowedCountries: gateway.allowedCountries || 'TZ,KE,UG,RW'
      });
    } else {
      // Reset form data
      setFormData({
        gatewayName: '',
        gatewayType: '',
        status: 'INACTIVE',
        isDefault: false,
        isTestMode: true,
        baseUrl: '',
        apiKey: '',
        secretKey: '',
        description: '',
        processingFeeRate: 0.025,
        processingFeeFixed: 0.0,
        minAmount: 100.0,
        maxAmount: 1000000.0,
        supportedCurrencies: 'TZS,USD',
        supportedPaymentMethods: 'MOBILE_MONEY,CREDIT_CARD',
        supportedMobileNetworks: 'MPESA,TIGO_PESA,AIRTEL_MONEY,HALOPESA',
        autoApproveEnabled: false,
        autoApproveAmountThreshold: 10000.0,
        fraudCheckEnabled: true,
        refundEnabled: true,
        settlementEnabled: true,
        settlementFrequency: 'DAILY',
        senderId: 'GGWiFi',
        costPerSms: 0.075,
        maxMessageLength: 160,
        unicodeSupport: true,
        deliveryReportsEnabled: true,
        rateLimitPerMinute: 60,
        rateLimitPerHour: 1000,
        rateLimitPerDay: 10000,
        bulkSmsEnabled: true,
        bulkSmsMaxRecipients: 1000,
        templateSmsEnabled: true,
        twoWaySmsEnabled: false,
        allowedCountries: 'TZ,KE,UG,RW'
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGateway(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = dialogMode === 'create' 
        ? `/api/v1/integration/${dialogType}-gateways`
        : `/api/v1/integration/${dialogType}-gateways/${selectedGateway.id}`;
      
      const method = dialogMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-ID': '1' // This would come from auth context
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSnackbar(`${dialogType.toUpperCase()} gateway ${dialogMode}d successfully`, 'success');
        handleCloseDialog();
        fetchIntegrationData();
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.message || 'Failed to save gateway configuration', 'error');
      }
    } catch (error) {
      console.error('Failed to save gateway configuration:', error);
      showSnackbar('Failed to save gateway configuration', 'error');
    }
  };

  const handleTestGateway = async (gateway, type) => {
    try {
      const response = await fetch(`/api/v1/integration/${type}-gateways/${gateway.id}/test`, {
        method: 'POST',
        headers: {
          'User-ID': '1'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTestResults(prev => ({
          ...prev,
          [`${type}-${gateway.id}`]: result.data
        }));
        showSnackbar(`Gateway test ${result.data.status}`, result.data.status === 'SUCCESS' ? 'success' : 'error');
      } else {
        showSnackbar('Failed to test gateway', 'error');
      }
    } catch (error) {
      console.error('Failed to test gateway:', error);
      showSnackbar('Failed to test gateway', 'error');
    }
  };

  const handleToggleStatus = async (gateway, type) => {
    try {
      const newStatus = gateway.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`/api/v1/integration/${type}-gateways/${gateway.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': '1'
        },
        body: JSON.stringify({
          ...gateway,
          status: newStatus
        })
      });

      if (response.ok) {
        showSnackbar(`Gateway ${newStatus.toLowerCase()}d successfully`, 'success');
        fetchIntegrationData();
      } else {
        showSnackbar('Failed to update gateway status', 'error');
      }
    } catch (error) {
      console.error('Failed to update gateway status:', error);
      showSnackbar('Failed to update gateway status', 'error');
    }
  };

  const handleSetDefault = async (gateway, type) => {
    try {
      const response = await fetch(`/api/v1/integration/${type}-gateways/${gateway.id}/set-default`, {
        method: 'POST',
        headers: {
          'User-ID': '1'
        }
      });

      if (response.ok) {
        showSnackbar('Gateway set as default successfully', 'success');
        fetchIntegrationData();
      } else {
        showSnackbar('Failed to set default gateway', 'error');
      }
    } catch (error) {
      console.error('Failed to set default gateway:', error);
      showSnackbar('Failed to set default gateway', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'MAINTENANCE': return 'warning';
      case 'SUSPENDED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircleIcon />;
      case 'INACTIVE': return <ErrorIcon />;
      case 'MAINTENANCE': return <WarningIcon />;
      case 'SUSPENDED': return <ErrorIcon />;
      default: return <InfoIcon />;
    }
  };

  const renderGatewayCard = (gateway, type) => {
    const testResult = testResults[`${type}-${gateway.id}`];
    
    return (
      <Card key={gateway.id} sx={{ mb: 2, border: gateway.isDefault ? '2px solid' : '1px solid', borderColor: gateway.isDefault ? 'primary.main' : 'divider' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" component="div">
                  {gateway.gatewayName}
                </Typography>
                {gateway.isDefault && (
                  <Chip
                    icon={<StarIcon />}
                    label="Default"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={getStatusIcon(gateway.status)}
                  label={gateway.status}
                  size="small"
                  color={getStatusColor(gateway.status)}
                  variant="outlined"
                />
                {gateway.isTestMode && (
                  <Chip
                    label="Test Mode"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {gateway.gatewayType} • {gateway.baseUrl}
              </Typography>
              {gateway.description && (
                <Typography variant="body2" color="text.secondary">
                  {gateway.description}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Test Gateway">
                <IconButton
                  size="small"
                  onClick={() => handleTestGateway(gateway, type)}
                  color={testResult?.status === 'SUCCESS' ? 'success' : 'default'}
                >
                  <TestIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Status">
                <IconButton
                  size="small"
                  onClick={() => handleToggleStatus(gateway, type)}
                  color={gateway.status === 'ACTIVE' ? 'success' : 'default'}
                >
                  <PowerIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Set as Default">
                <IconButton
                  size="small"
                  onClick={() => handleSetDefault(gateway, type)}
                  color={gateway.isDefault ? 'primary' : 'default'}
                >
                  {gateway.isDefault ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Configuration">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(type, 'edit', gateway)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Test Result */}
          {testResult && (
            <Alert 
              severity={testResult.status === 'SUCCESS' ? 'success' : 'error'} 
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                Test Result: {testResult.message}
              </Typography>
              {testResult.responseTime && (
                <Typography variant="caption">
                  Response Time: {testResult.responseTime}
                </Typography>
              )}
            </Alert>
          )}

          {/* Gateway Statistics */}
          <Grid container spacing={2}>
            {type === 'payment' && (
              <>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      {gateway.totalTransactions || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main">
                      {gateway.successRate || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="info.main">
                      {gateway.totalAmount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="warning.main">
                      {gateway.averageResponseTimeMs || 0}ms
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
            {type === 'sms' && (
              <>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      {gateway.totalSmsSent || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total SMS Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main">
                      {gateway.successRate || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="info.main">
                      {gateway.totalCost || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Cost
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="warning.main">
                      {gateway.currentBalance || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current Balance
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderConfigurationForm = () => {
    return (
      <Box>
        <Grid container spacing={3}>
          {/* Basic Configuration */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Configuration
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Gateway Name"
              value={formData.gatewayName}
              onChange={(e) => handleFormChange('gatewayName', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Gateway Type</InputLabel>
              <Select
                value={formData.gatewayType}
                onChange={(e) => handleFormChange('gatewayType', e.target.value)}
                label="Gateway Type"
              >
                {dialogType === 'payment' ? (
                  <>
                    <MenuItem value="ZENOPAY">ZenoPay</MenuItem>
                    <MenuItem value="STRIPE">Stripe</MenuItem>
                    <MenuItem value="PAYPAL">PayPal</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="TWILIO">Twilio</MenuItem>
                    <MenuItem value="NEXMO">Nexmo</MenuItem>
                    <MenuItem value="SMS_GATEWAY">SMS Gateway</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Base URL"
              value={formData.baseUrl}
              onChange={(e) => handleFormChange('baseUrl', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={formData.apiKey}
              onChange={(e) => handleFormChange('apiKey', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Secret Key"
              type="password"
              value={formData.secretKey}
              onChange={(e) => handleFormChange('secretKey', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
            />
          </Grid>

          {/* Configuration Options */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Configuration Options
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e) => handleFormChange('isDefault', e.target.checked)}
                />
              }
              label="Set as Default Gateway"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isTestMode}
                  onChange={(e) => handleFormChange('isTestMode', e.target.checked)}
                />
              }
              label="Test Mode"
            />
          </Grid>

          {/* Payment Gateway Specific */}
          {dialogType === 'payment' && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Payment Configuration
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Processing Fee Rate (%)"
                  type="number"
                  step="0.001"
                  value={formData.processingFeeRate}
                  onChange={(e) => handleFormChange('processingFeeRate', parseFloat(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fixed Processing Fee"
                  type="number"
                  step="0.01"
                  value={formData.processingFeeFixed}
                  onChange={(e) => handleFormChange('processingFeeFixed', parseFloat(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Amount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => handleFormChange('minAmount', parseFloat(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Amount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => handleFormChange('maxAmount', parseFloat(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supported Currencies"
                  value={formData.supportedCurrencies}
                  onChange={(e) => handleFormChange('supportedCurrencies', e.target.value)}
                  helperText="Comma-separated list (e.g., TZS,USD,EUR)"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supported Payment Methods"
                  value={formData.supportedPaymentMethods}
                  onChange={(e) => handleFormChange('supportedPaymentMethods', e.target.value)}
                  helperText="Comma-separated list"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supported Mobile Networks"
                  value={formData.supportedMobileNetworks}
                  onChange={(e) => handleFormChange('supportedMobileNetworks', e.target.value)}
                  helperText="Comma-separated list (e.g., MPESA,TIGO_PESA,AIRTEL_MONEY,HALOPESA)"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoApproveEnabled}
                      onChange={(e) => handleFormChange('autoApproveEnabled', e.target.checked)}
                    />
                  }
                  label="Auto Approve Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.fraudCheckEnabled}
                      onChange={(e) => handleFormChange('fraudCheckEnabled', e.target.checked)}
                    />
                  }
                  label="Fraud Check Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.refundEnabled}
                      onChange={(e) => handleFormChange('refundEnabled', e.target.checked)}
                    />
                  }
                  label="Refund Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.settlementEnabled}
                      onChange={(e) => handleFormChange('settlementEnabled', e.target.checked)}
                    />
                  }
                  label="Settlement Enabled"
                />
              </Grid>
            </>
          )}

          {/* SMS Gateway Specific */}
          {dialogType === 'sms' && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  SMS Configuration
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sender ID"
                  value={formData.senderId}
                  onChange={(e) => handleFormChange('senderId', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cost per SMS"
                  type="number"
                  step="0.001"
                  value={formData.costPerSms}
                  onChange={(e) => handleFormChange('costPerSms', parseFloat(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Message Length"
                  type="number"
                  value={formData.maxMessageLength}
                  onChange={(e) => handleFormChange('maxMessageLength', parseInt(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rate Limit (per minute)"
                  type="number"
                  value={formData.rateLimitPerMinute}
                  onChange={(e) => handleFormChange('rateLimitPerMinute', parseInt(e.target.value))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Allowed Countries"
                  value={formData.allowedCountries}
                  onChange={(e) => handleFormChange('allowedCountries', e.target.value)}
                  helperText="Comma-separated country codes (e.g., TZ,KE,UG,RW)"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.unicodeSupport}
                      onChange={(e) => handleFormChange('unicodeSupport', e.target.checked)}
                    />
                  }
                  label="Unicode Support"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.deliveryReportsEnabled}
                      onChange={(e) => handleFormChange('deliveryReportsEnabled', e.target.checked)}
                    />
                  }
                  label="Delivery Reports Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.bulkSmsEnabled}
                      onChange={(e) => handleFormChange('bulkSmsEnabled', e.target.checked)}
                    />
                  }
                  label="Bulk SMS Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.templateSmsEnabled}
                      onChange={(e) => handleFormChange('templateSmsEnabled', e.target.checked)}
                    />
                  }
                  label="Template SMS Enabled"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.twoWaySmsEnabled}
                      onChange={(e) => handleFormChange('twoWaySmsEnabled', e.target.checked)}
                    />
                  }
                  label="Two-Way SMS Enabled"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Integration Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(activeTab === 0 ? 'payment' : 'sms', 'create')}
        >
          Add Gateway
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="primary">
                    {statistics.totalPaymentGateways || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment Gateways
                  </Typography>
                </Box>
                <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="success.main">
                    {statistics.totalSmsGateways || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SMS Gateways
                  </Typography>
                </Box>
                <SmsIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="info.main">
                    {statistics.activePaymentGateways || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Payment Gateways
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {statistics.activeSmsGateways || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active SMS Gateways
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <PaymentIcon />
                  Payment Gateways
                  <Badge badgeContent={paymentGateways.length} color="primary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <SmsIcon />
                  SMS Gateways
                  <Badge badgeContent={smsGateways.length} color="success" />
                </Box>
              } 
            />
          </Tabs>
        </Box>

        <CardContent>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Gateway Configurations
              </Typography>
              {paymentGateways.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <PaymentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Payment Gateways Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Add your first payment gateway to start processing payments
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('payment', 'create')}
                  >
                    Add Payment Gateway
                  </Button>
                </Box>
              ) : (
                paymentGateways.map(gateway => renderGatewayCard(gateway, 'payment'))
              )}
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                SMS Gateway Configurations
              </Typography>
              {smsGateways.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SmsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No SMS Gateways Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Add your first SMS gateway to start sending notifications
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('sms', 'create')}
                  >
                    Add SMS Gateway
                  </Button>
                </Box>
              ) : (
                smsGateways.map(gateway => renderGatewayCard(gateway, 'sms'))
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New' : 'Edit'} {dialogType.toUpperCase()} Gateway
        </DialogTitle>
        <DialogContent>
          {renderConfigurationForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IntegrationManagement;
