import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Router as RouterIcon,
  Wifi as WifiIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Feedback as FeedbackIcon,
  Article as ArticleIcon,
  Build as BuildIcon,
  AccountCircle,
  Notifications,
  Logout,
  Person,
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
  AttachMoney as MoneyIcon,
  Store as StoreIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  SwapHoriz as TransactionIcon,
  Description as InvoiceIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '/src/store/authStore.js';

// Premium Design System Colors
const palette = {
  gold: '#F5C400',           // Gold Prime
  goldStrong: '#D4A100',     // Gold Deep
  black: '#0B0B0B',          // Carbon Black
  white: '#FFFFFF',          // Soft White
  neutral100: '#F6F6F6',     // Frost Grey (light)
  neutral300: '#EDEDED',     // Frost Grey
  slateGrey: '#8D8D8D',      // Slate Grey
};

const drawerWidth = 280;
const collapsedWidth = 72;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuthStore();

  console.log('🔍 MainLayout rendered:', { user: user?.username, location: location.pathname });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // Navigation items with permissions
  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      permission: 'dashboard',
    },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      path: '/users',
      permission: 'users',
    },
    {
      text: 'Internet Packages',
      icon: <InventoryIcon />,
      path: '/packages',
      permission: 'packages',
    },
    {
      text: 'Voucher Management',
      icon: <ReceiptIcon />,
      path: '/vouchers',
      permission: 'packages', // Using packages permission for vouchers
    },
    {
      text: 'Router Management',
      icon: <RouterIcon />,
      path: '/routers',
      permission: 'routers',
    },
    {
      text: 'Customer Management',
      icon: <StoreIcon />,
      path: '/customers',
      permission: 'customers',
    },
    {
      text: 'Finance & Payments',
      icon: <MoneyIcon />,
      path: '/finance',
      permission: 'finance',
    },
    {
      text: 'Transactions',
      icon: <TransactionIcon />,
      path: '/transactions',
      permission: 'finance',
    },
    {
      text: 'Invoices',
      icon: <InvoiceIcon />,
      path: '/invoices',
      permission: 'finance',
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      path: '/payments',
      permission: 'finance',
    },
    {
      text: 'Analytics & Reports',
      icon: <AnalyticsIcon />,
      path: '/analytics',
      permission: 'reports',
    },
    {
      text: 'Session Management',
      icon: <TimelineIcon />,
      path: '/sessions',
      permission: 'dashboard', // Using dashboard permission for sessions
    },
    {
      text: 'VPN Management',
      icon: <SecurityIcon />,
      path: '/vpn',
      permission: 'routers', // Using routers permission for VPN
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      permission: 'settings',
    },
  ];

  const handleDrawerToggle = () => {
    // Global toggle: on mobile -> open temporary drawer; on desktop -> collapse/expand permanent drawer
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const toggleExpanded = (itemText) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  // Filter navigation items based on permissions
  const filteredNavigationItems = navigationItems.filter(item => {
    // Always show all items for ADMIN role
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      return true;
    }
    // Otherwise check permissions
    return hasPermission(item.permission);
  });
  
  console.log('🔍 MainLayout - Navigation items:', {
    totalItems: navigationItems.length,
    filteredItems: filteredNavigationItems.length,
    userRole: user?.role,
    permissions: user?.permissions || []
  });


  const drawer = (
        <Box
          sx={{
            height: '100%',
            background: '#FFFFFF',  // White sidebar - ZenoPay Style
            color: '#1A1A1A',       // Charcoal Black text/icons
            borderRight: `1px solid #EFEFEF`,  // Very light grey divider
          }}
        >
      {/* GG Wi-Fi Logo and Branding */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid #EFEFEF`,  // Very light grey divider
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: ggwifiTheme.gradients.primary,
                color: palette.black,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                boxShadow: ggwifiTheme.shadows.golden,
              }}
            >
              GG
            </Avatar>
          </Box>
          
          <Typography
            variant="h6"
            sx={{
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.bold,
              color: '#1A1A1A',  // Charcoal Black text
              mb: 0.5,
              display: { xs: 'inline', md: desktopCollapsed ? 'none' : 'inline' },
            }}
          >
            GG Wi-Fi
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              color: '#505050',  // Label grey
              fontStyle: 'italic',
              fontSize: ggwifiTheme.typography.fontSize.xs,
              display: { xs: 'inline', md: desktopCollapsed ? 'none' : 'inline' },
            }}
          >
            The Signal That Cares
          </Typography>
        </motion.div>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {filteredNavigationItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  position: 'relative',
                  borderRadius: ggwifiTheme.borderRadius.md,
                  mb: 0.5,
                  px: desktopCollapsed ? 1 : 2,
                  backgroundColor: location.pathname === item.path 
                    ? '#FFE89C'  // Pale yellow highlight for active
                    : 'transparent',
                  color: location.pathname === item.path ? '#1A1A1A' : '#1A1A1A',  // Black text always
                  transition: 'all 0.2s ease',
                  justifyContent: { md: desktopCollapsed ? 'center' : 'flex-start' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',  // Yellow vertical bar (4px)
                    height: '80%',
                    borderRadius: '0 2px 2px 0',
                    backgroundColor: location.pathname === item.path ? '#F5C400' : 'transparent',  // Yellow active indicator
                  },
                  '&:hover': {
                    backgroundColor: '#FFE89C',  // Pale yellow highlight on hover
                    '& .MuiListItemIcon-root': {
                      color: '#F5C400',  // Yellow icon on hover
                    },
                    '& .MuiListItemText-primary': {
                      color: '#1A1A1A',  // Black text
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path 
                      ? '#F5C400'  // Yellow icon when active
                      : '#1A1A1A', // Charcoal icon when inactive
                    minWidth: { xs: 40, md: desktopCollapsed ? 'auto' : 40 },
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: ggwifiTheme.typography.fontFamily.primary,
                      fontWeight: location.pathname === item.path 
                        ? ggwifiTheme.typography.fontWeight.semibold 
                        : ggwifiTheme.typography.fontWeight.medium,
                      color: '#1A1A1A',  // Charcoal Black text always
                      fontSize: ggwifiTheme.typography.fontSize.sm,
                      display: { md: desktopCollapsed ? 'none' : 'inline' },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {/* User Info Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTop: `1px solid #EFEFEF`,  // Very light grey divider
          background: '#FFFFFF',  // White background
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SecurityIcon sx={{ fontSize: 16, color: palette.goldStrong }} />
          <Typography
            variant="caption"
            sx={{
              color: '#505050',  // Label grey
              fontSize: ggwifiTheme.typography.fontSize.xs,
            }}
          >
            Secure Connection
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: '#505050',  // Label grey
            fontSize: ggwifiTheme.typography.fontSize.xs,
          }}
        >
          © 2025 GG Wi-Fi
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${(desktopCollapsed ? collapsedWidth : drawerWidth)}px)` },
          ml: { md: `${desktopCollapsed ? collapsedWidth : drawerWidth}px` },
          background: '#1A1A1A',  // Charcoal Black - ZenoPay Style
          color: '#FFFFFF',  // White text
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: '2px solid #F5C400',  // Thin yellow bottom border
          height: '64px',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: '#FFFFFF',  // White icon on black navbar
              '&:hover': {
                color: '#F5C400',  // Yellow on hover
                backgroundColor: 'rgba(245, 196, 0, 0.15)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.semibold,
              color: '#FFFFFF',  // White text on black navbar
            }}
          >
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            sx={{ 
              color: '#FFFFFF',  // White icon on black navbar
              mr: 1,
              '&:hover': {
                color: '#F5C400',  // Yellow on hover
                backgroundColor: 'rgba(245, 196, 0, 0.15)',
              }
            }}
          >
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<AdminPanelSettings />}
              label={user?.role || 'User'}
              size="small"
              sx={{
                backgroundColor: 'rgba(245, 196, 0, 0.15)',  // Pale yellow background
                color: '#1A1A1A',  // Charcoal text
                border: `1px solid #F5C400`,  // Yellow border
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.medium,
              }}
            />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ 
                color: '#FFFFFF',  // White icon on black navbar
                '&:hover': {
                  color: '#F5C400',  // Yellow on hover
                  backgroundColor: 'rgba(245, 196, 0, 0.15)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: '#F5F5F5',  // Neutral grey background
                  color: '#1A1A1A',  // Charcoal text
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  border: '2px solid #F5C400',  // Thin yellow border (2px)
                  boxShadow: 'none',  // No shadow - clean enterprise look
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          {/* Profile Menu */}
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            sx={{
              '& .MuiPaper-root': {
                background: ggwifiTheme.gradients.card,
                borderRadius: ggwifiTheme.borderRadius.lg,
                border: `1px solid rgba(245, 183, 0, 0.2)`,
                boxShadow: ggwifiTheme.shadows.golden,
              },
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: desktopCollapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    background: '#FFFFFF',  // White sidebar
                    borderRight: `1px solid #EFEFEF`,  // Very light grey divider
                  },
                }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: desktopCollapsed ? collapsedWidth : drawerWidth,
              background: palette.white,
              borderRight: `1px solid ${palette.neutral300}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${(desktopCollapsed ? collapsedWidth : drawerWidth)}px)` },
          mt: 8, // Account for AppBar height
          background: '#FFFFFF',  // White background - ZenoPay Style
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default MainLayout;