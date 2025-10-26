import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
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
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Speed,
  Wifi,
  Router,
  Public,
  TrendingUp,
  AttachMoney,
  Visibility,
  MoreVert,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock internet plans data
const mockPlans = [
  {
    id: 1,
    name: 'Premium Hotspot 24H',
    type: 'HOTSPOT',
    duration: '24 hours',
    price: 5000,
    bandwidth: '10 Mbps',
    dataLimit: 'Unlimited',
    description: 'High-speed internet for 24 hours',
    isActive: true,
    features: ['High Speed', 'Unlimited Data', '24/7 Support'],
    customers: 245,
    revenue: 1225000,
  },
  {
    id: 2,
    name: 'Business PPPoE Monthly',
    type: 'PPPOE',
    duration: '30 days',
    price: 50000,
    bandwidth: '50 Mbps',
    dataLimit: 'Unlimited',
    description: 'Business-grade internet connection',
    isActive: true,
    features: ['Static IP', 'Priority Support', 'SLA Guarantee'],
    customers: 89,
    revenue: 4450000,
  },
  {
    id: 3,
    name: 'Basic Hotspot 1H',
    type: 'HOTSPOT',
    duration: '1 hour',
    price: 1000,
    bandwidth: '5 Mbps',
    dataLimit: '1 GB',
    description: 'Quick internet access for 1 hour',
    isActive: true,
    features: ['Quick Access', 'Low Cost', 'Easy Setup'],
    customers: 156,
    revenue: 156000,
  },
  {
    id: 4,
    name: 'Enterprise Static IP',
    type: 'STATIC_IP',
    duration: '30 days',
    price: 100000,
    bandwidth: '100 Mbps',
    dataLimit: 'Unlimited',
    description: 'Enterprise-grade connection with static IP',
    isActive: true,
    features: ['Static IP', '99.9% Uptime', 'Dedicated Support'],
    customers: 23,
    revenue: 2300000,
  },
];

const InternetPlans = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const planTypes = [
    { value: 'ALL', label: 'All Plans', icon: <Public /> },
    { value: 'HOTSPOT', label: 'Hotspot', icon: <Wifi /> },
    { value: 'PPPOE', label: 'PPPoE', icon: <Router /> },
    { value: 'STATIC_IP', label: 'Static IP', icon: <Speed /> },
  ];

  const filteredPlans = filterType === 'ALL' 
    ? plans 
    : plans.filter(plan => plan.type === filterType);

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setOpenDialog(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const togglePlanStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'HOTSPOT': return <Wifi />;
      case 'PPPOE': return <Router />;
      case 'STATIC_IP': return <Speed />;
      default: return <Public />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'HOTSPOT': return '#4CAF50';
      case 'PPPOE': return '#2196F3';
      case 'STATIC_IP': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const PlanCard = ({ plan }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: `2px solid ${plan.isActive ? '#FFD70040' : '#333333'}`,
        position: 'relative',
        '&:hover': {
          border: `2px solid ${plan.isActive ? '#FFD700' : '#555555'}`,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
        }
      }}>
        {/* Status Badge */}
        <Chip
          label={plan.isActive ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: plan.isActive ? '#4CAF50' : '#F44336',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        />

        <CardContent>
          {/* Plan Header */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ 
              bgcolor: getTypeColor(plan.type), 
              mr: 2,
              width: 48,
              height: 48,
            }}>
              {getTypeIcon(plan.type)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                {plan.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>
                {plan.type} • {plan.duration}
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#FFD700' }}>
              <MoreVert />
            </IconButton>
          </Box>

          {/* Plan Details */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>Bandwidth:</Typography>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                {plan.bandwidth}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>Data Limit:</Typography>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                {plan.dataLimit}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>Customers:</Typography>
              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                {plan.customers}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>Revenue:</Typography>
              <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {formatCurrency(plan.revenue)}
              </Typography>
            </Box>
          </Box>

          {/* Price */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
              {formatCurrency(plan.price)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#BFBFBF' }}>
              per {plan.duration}
            </Typography>
          </Box>

          {/* Features */}
          <Box mb={3}>
            <Typography variant="body2" sx={{ color: '#BFBFBF', mb: 1 }}>
              Features:
            </Typography>
            {plan.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                sx={{
                  bgcolor: '#FFD70020',
                  color: '#FFD700',
                  fontSize: '0.7rem',
                  mr: 0.5,
                  mb: 0.5,
                }}
              />
            ))}
          </Box>

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={plan.isActive}
                  onChange={() => togglePlanStatus(plan.id)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#FFD700',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#FFD700',
                      },
                    },
                  }}
                />
              }
              label={plan.isActive ? 'Active' : 'Inactive'}
              sx={{ color: '#BFBFBF', m: 0 }}
            />
            <Box display="flex" gap={1}>
              <Tooltip title="View Details">
                <IconButton size="small" sx={{ color: '#2196F3' }}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Plan">
                <IconButton size="small" sx={{ color: '#FFD700' }}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Plan">
                <IconButton size="small" sx={{ color: '#F44336' }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
          Internet Plans Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddPlan}
          sx={{
            backgroundColor: '#FFD700',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#E6C200',
            },
          }}
        >
          Add New Plan
        </Button>
      </Box>

      {/* Plan Type Tabs */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '1px solid #FFD70020',
      }}>
        <CardContent>
          <Tabs
            value={filterType}
            onChange={(e, newValue) => setFilterType(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#BFBFBF',
                '&.Mui-selected': {
                  color: '#FFD700',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
              },
            }}
          >
            {planTypes.map((type) => (
              <Tab
                key={type.value}
                value={type.value}
                label={type.label}
                icon={type.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <Grid container spacing={3}>
        {filteredPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id}>
            <PlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <Card sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #FFD70020',
          textAlign: 'center',
          py: 8,
        }}>
          <CardContent>
            <Public sx={{ fontSize: 64, color: '#FFD700', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
              No Plans Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#BFBFBF', mb: 3 }}>
              {filterType === 'ALL' 
                ? 'No internet plans available. Create your first plan to get started.'
                : `No ${filterType.toLowerCase()} plans available.`
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddPlan}
              sx={{
                backgroundColor: '#FFD700',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#E6C200',
                },
              }}
            >
              Add New Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add plan"
        onClick={handleAddPlan}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#FFD700',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#E6C200',
          },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default InternetPlans;
