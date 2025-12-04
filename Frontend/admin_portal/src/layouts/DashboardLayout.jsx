import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Router as RouterIcon,
  Inventory as PackageIcon,
  ConfirmationNumber as VoucherIcon,
  AttachMoney as FinanceIcon,
  Star as LoyaltyIcon,
  Settings as SettingsIcon,
  BugReport as BugReportIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
  Build as BuildIcon,
  MonetizationOn as MonetizationIcon
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';

const DRAWER_WIDTH = 280;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, canAccessModule } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' }
    ];

    const roleItems = {
      ADMIN: [
        { text: 'User Management', icon: PeopleIcon, path: '/admin/users', permission: 'MANAGE_USERS' },
        { text: 'System Settings', icon: SettingsIcon, path: '/admin/settings', permission: 'MANAGE_SETTINGS' }
      ],
      TECHNICIAN: [
        { text: 'Router Management', icon: RouterIcon, path: '/routers', permission: 'MANAGE_ROUTERS' },
        { text: 'Network Diagnostics', icon: BuildIcon, path: '/routers/diagnostics', permission: 'VIEW_ROUTERS' }
      ],
      FINANCE: [
        { text: 'Finance Overview', icon: FinanceIcon, path: '/finance', permission: 'VIEW_FINANCE' },
        { text: 'Invoices', icon: MonetizationIcon, path: '/finance/invoices', permission: 'MANAGE_FINANCE' },
        { text: 'Reports', icon: AnalyticsIcon, path: '/finance/reports', permission: 'VIEW_REPORTS' }
      ],
      MARKETING: [
        { text: 'Marketing Suite', icon: CampaignIcon, path: '/marketing', permission: 'MANAGE_CAMPAIGNS' }
      ]
    };

    const commonItems = [
      { text: 'Customers', icon: PeopleIcon, path: '/customers', permission: 'VIEW_CUSTOMERS' },
      { text: 'Internet Plans', icon: PackageIcon, path: '/packages', permission: 'VIEW_PACKAGES' },
      { text: 'Vouchers', icon: VoucherIcon, path: '/vouchers', permission: 'VIEW_VOUCHERS' }
    ];

    // Add role-specific items
    const roleSpecificItems = roleItems[user?.role] || [];
    
    // Filter items based on permissions
    const filteredRoleItems = roleSpecificItems.filter(item => 
      !item.permission || canAccessModule(item.permission.toLowerCase())
    );
    
    const filteredCommonItems = commonItems.filter(item => 
      canAccessModule(item.permission.toLowerCase())
    );

    return [...baseItems, ...filteredRoleItems, ...filteredCommonItems];
  };

  const navigationItems = getNavigationItems();

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
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'error';
      case 'TECHNICIAN':
        return 'primary';
      case 'FINANCE':
        return 'success';
      case 'MARKETING':
      case 'SALES':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <img 
          src="/GG.png" 
          alt="GGWiFi Logo" 
          style={{ 
            width: '40px', 
            height: '40px',
            marginRight: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          GGWiFi
        </Typography>
      </Box>

      {/* User Info Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.fullName || user?.username || 'User'}
            </Typography>
            <Chip 
              label={user?.role || 'USER'} 
              size="small" 
              color={getRoleColor(user?.role)}
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? 'white' : 'text.secondary',
                  minWidth: 40
                }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          GGWiFi Admin Portal v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Tooltip title="Account settings">
              <IconButton onClick={handleProfileMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper'
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
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider'
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
          p: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;