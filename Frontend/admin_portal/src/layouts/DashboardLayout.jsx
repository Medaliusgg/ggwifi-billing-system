import { useState } from 'react';
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
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { NAVIGATION_ITEMS, USER_ROLES } from '@/utils/constants';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 60;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuthStore();
  const { 
    sidebarOpen, 
    toggleSidebar, 
    setSidebarOpen,
    notifications,
    unreadCount,
    openModal,
  } = useUIStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const drawerContent = (
    <Box className="h-full bg-gg-charcoal flex flex-col">
      {/* Logo Section */}
      <Box className="p-4 border-b border-gg-gold border-opacity-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <Box className="w-10 h-10 bg-gg-gold rounded-xl flex items-center justify-center">
            <Typography
              variant="h6"
              className="text-gg-black font-bold"
            >
              G
            </Typography>
          </Box>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="h6"
                  className="text-gg-gold font-bold"
                >
                  GGWIFI
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gg-text-muted"
                >
                  Admin Portal
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Box>

      {/* Navigation Items */}
      <Box className="flex-1 py-4">
        <List className="px-2">
          {NAVIGATION_ITEMS.filter(item => 
            !item.roles || item.roles.includes(user?.role)
          ).map((item, index) => {
            const isActive = location.pathname === item.path;
            const IconComponent = getIconComponent(item.icon);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem disablePadding className="mb-1">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    className={`rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gg-gold bg-opacity-20 text-gg-gold' 
                        : 'text-gg-text-secondary hover:text-gg-gold hover:bg-gg-gold hover:bg-opacity-10'
                    }`}
                    sx={{
                      minHeight: 48,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? 'inherit' : 'inherit',
                      }}
                    >
                      <IconComponent />
                    </ListItemIcon>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: '0.95rem',
                              fontWeight: isActive ? 600 : 500,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* User Info Section */}
      <Box className="p-4 border-t border-gg-gold border-opacity-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <Avatar
            className="bg-gg-gold text-gg-black font-semibold"
            sx={{ width: 32, height: 32 }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0"
              >
                <Typography
                  variant="body2"
                  className="text-gg-text-primary font-medium truncate"
                >
                  {user?.fullName || 'Admin User'}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gg-text-muted"
                >
                  {user?.role || 'Administrator'}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Box className="flex h-screen bg-gg-black">
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? sidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(255, 215, 0, 0.2)',
            backgroundColor: '#1E1E1E',
            transition: 'width 0.3s ease-in-out',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)` },
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: '#1E1E1E',
            borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <Toolbar className="justify-between">
            {/* Left Section */}
            <Box className="flex items-center space-x-4">
              <IconButton
                onClick={toggleSidebar}
                className="text-gg-text-primary hover:text-gg-gold"
              >
                <MenuIcon />
              </IconButton>
              
              <Box className="flex items-center space-x-2">
                <SearchIcon className="text-gg-text-muted" />
                <Typography
                  variant="body2"
                  className="text-gg-text-muted"
                >
                  Search...
                </Typography>
              </Box>
            </Box>

            {/* Right Section */}
            <Box className="flex items-center space-x-2">
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationMenuOpen}
                  className="text-gg-text-primary hover:text-gg-gold"
                >
                  <Badge badgeContent={unreadCount} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Profile Menu */}
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  className="text-gg-text-primary hover:text-gg-gold"
                >
                  <Avatar
                    className="bg-gg-gold text-gg-black"
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box className="p-6">
          {children}
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2E2E2E',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountIcon className="text-gg-gold" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon className="text-gg-gold" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: 'rgba(255, 215, 0, 0.2)' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon className="text-red-400" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2E2E2E',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: 2,
            maxHeight: 400,
            width: 320,
          },
        }}
      >
        <Box className="p-4 border-b border-gg-gold border-opacity-20">
          <Typography variant="h6" className="text-gg-text-primary">
            Notifications
          </Typography>
        </Box>
        <Box className="max-h-64 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem key={notification.id}>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                />
              </MenuItem>
            ))
          ) : (
            <Box className="p-4 text-center">
              <Typography variant="body2" className="text-gg-text-muted">
                No notifications
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
};

// Helper function to get icon components
const getIconComponent = (iconName) => {
  const icons = {
    Dashboard: DashboardIcon,
    People: PeopleIcon,
    Router: RouterIcon,
    Package: PackageIcon,
    ConfirmationNumber: VoucherIcon,
    AttachMoney: FinanceIcon,
    Star: LoyaltyIcon,
    Settings: SettingsIcon,
  };
  return icons[iconName] || DashboardIcon;
};

export default DashboardLayout;
