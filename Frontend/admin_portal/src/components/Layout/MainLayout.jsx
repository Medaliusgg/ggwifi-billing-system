import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    badge: null,
    category: 'main',
  },
  {
    text: 'User Management',
    icon: <PeopleIcon />,
    path: '/users',
    badge: null,
    category: 'management',
  },
  {
    text: 'Internet Packages',
    icon: <InventoryIcon />,
    path: '/packages',
    badge: null,
    category: 'management',
  },
  {
    text: 'Hotspot Vouchers',
    icon: <ReceiptIcon />,
    path: '/vouchers',
    badge: null,
    category: 'management',
  },
  {
    text: 'Payment Records',
    icon: <ReceiptIcon />,
    path: '/payments',
    badge: null,
    category: 'management',
  },
  {
    text: 'Router Management',
    icon: <RouterIcon />,
    path: '/routers',
    badge: null,
    category: 'infrastructure',
  },
  {
    text: 'Active Sessions',
    icon: <WifiIcon />,
    path: '/sessions',
    badge: null,
    category: 'infrastructure',
  },
  {
    text: 'System Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
    badge: null,
    category: 'reports',
  },
  {
    text: 'Installation Services',
    icon: <BuildIcon />,
    path: '/installations',
    badge: null,
    category: 'services',
  },
  {
    text: 'Customer Feedback',
    icon: <FeedbackIcon />,
    path: '/feedback',
    badge: null,
    category: 'services',
  },
  {
    text: 'Blog Management',
    icon: <ArticleIcon />,
    path: '/blog',
    badge: null,
    category: 'content',
  },
  {
    text: 'System Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    badge: null,
    category: 'admin',
  },
];

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(21, 101, 192, 0.05) 100%)',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1976d2',
            mb: 0.5,
          }}
        >
          GGNetworks
        </Typography>
        <Typography 
          variant="caption" 
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          Administrative Portal
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 1 }}>
          {(() => {
            const categories = {
              main: 'Main',
              management: 'Management',
              infrastructure: 'Infrastructure',
              reports: 'Reports & Analytics',
              services: 'Services',
              content: 'Content',
              admin: 'Administration',
            };

            let currentCategory = '';
            return menuItems.map((item, index) => {
              const showCategory = currentCategory !== item.category;
              if (showCategory) {
                currentCategory = item.category;
              }

              return (
                <React.Fragment key={item.text}>
                  {showCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ px: 2, py: 1, mt: 2 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            fontSize: '0.7rem',
                          }}
                        >
                          {categories[item.category]}
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) setMobileOpen(false);
                        }}
                        selected={location.pathname === item.path}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                          },
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.08)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: location.pathname === item.path ? 'white' : 'text.secondary',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: location.pathname === item.path ? 600 : 500,
                            fontSize: '0.9rem',
                          }}
                        />
                        {item.badge && (
                          <Badge badgeContent={item.badge} color="error" />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                </React.Fragment>
              );
            });
          })()}
        </List>
      </Box>

      {/* User Info */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(21, 101, 192, 0.02) 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              mr: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            }}
          >
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {user?.fullName || 'Administrator'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {user?.phoneNumber || 'admin@ggnetworks.co.tz'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label="System Administrator"
          size="small"
          color="primary"
          sx={{ 
            width: '100%',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {(() => {
                const currentItem = menuItems.find(item => item.path === location.pathname);
                const categories = {
                  main: 'Main Dashboard',
                  management: 'Business Management',
                  infrastructure: 'Network Infrastructure',
                  reports: 'Analytics & Reports',
                  services: 'Customer Services',
                  content: 'Content Management',
                  admin: 'System Administration',
                };
                return currentItem ? categories[currentItem.category] : 'System Overview';
              })()}
            </Typography>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout; 