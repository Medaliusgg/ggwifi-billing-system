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
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const palette = {
  gold: 'var(--gg-gold)',
  goldStrong: 'var(--gg-gold-strong)',
  black: 'var(--gg-black)',
  white: 'var(--gg-white)',
  neutral100: 'var(--gg-neutral-100)',
  neutral300: 'var(--gg-neutral-300)',
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
            background: palette.white,
            color: palette.black,
            borderRight: `1px solid ${palette.neutral300}`,
          }}
        >
      {/* GG Wi-Fi Logo and Branding */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid ${palette.neutral300}`,
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
              background: ggwifiTheme.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 0.5,
              display: { xs: 'inline', md: desktopCollapsed ? 'none' : 'inline' },
            }}
          >
            GG Wi-Fi
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              color: palette.black,
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
                    ? palette.gold 
                    : 'transparent',
                  color: location.pathname === item.path ? palette.black : palette.black,
                  transition: ggwifiTheme.transitions.normal,
                  justifyContent: { md: desktopCollapsed ? 'center' : 'flex-start' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: desktopCollapsed ? '50%' : 0,
                    top: 10,
                    bottom: 10,
                    width: 3,
                    borderRadius: 999,
                    backgroundColor: location.pathname === item.path ? palette.black : 'transparent',
                    transform: desktopCollapsed ? 'translateX(-50%)' : 'none',
                  },
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? palette.gold : 'rgba(242,201,76,0.2)',
                    transform: desktopCollapsed ? 'none' : 'translateX(2px)',
                    '& .MuiListItemIcon-root': {
                      color: palette.goldStrong,
                    },
                    '& .MuiListItemText-primary': {
                      color: palette.goldStrong,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path 
                      ? palette.black
                      : palette.black,
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
                        : ggwifiTheme.typography.fontWeight.normal,
                      color: location.pathname === item.path 
                        ? palette.black
                        : palette.black,
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
          borderTop: `1px solid ${palette.neutral300}`,
          background: palette.neutral100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SecurityIcon sx={{ fontSize: 16, color: palette.goldStrong }} />
          <Typography
            variant="caption"
            sx={{
              color: palette.black,
              fontSize: ggwifiTheme.typography.fontSize.xs,
            }}
          >
            Secure Connection
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: palette.black,
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
          background: palette.white,
          color: palette.black,
          boxShadow: '0 4px 12px rgba(10,10,10,0.08)',
          borderBottom: `1px solid ${palette.neutral300}`,
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
              color: palette.black,
              '&:hover': {
                color: palette.goldStrong,
                backgroundColor: 'rgba(242, 201, 76, 0.15)',
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
              color: palette.black,
            }}
          >
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            sx={{ 
              color: palette.black,
              mr: 1,
              '&:hover': {
                color: palette.goldStrong,
                backgroundColor: 'rgba(242, 201, 76, 0.15)',
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
                backgroundColor: 'rgba(242, 201, 76, 0.18)',
                color: palette.black,
                border: `1px solid ${palette.gold}`,
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
                color: palette.black,
                '&:hover': {
                  color: palette.goldStrong,
                  backgroundColor: 'rgba(242, 201, 76, 0.15)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: ggwifiTheme.gradients.primary,
                  color: palette.black,
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
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
                    background: palette.white,
                    borderRight: `1px solid ${palette.neutral300}`,
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
          background: palette.neutral100,
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