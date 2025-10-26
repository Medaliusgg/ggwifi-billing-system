import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  useTheme, 
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  WhatsApp as WhatsAppIcon, 
  LocationOn as LocationIcon, 
  Chat as ChatIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ currentLanguage, onPhoneCall, onWhatsApp, onCoverageClick, onContactSupportClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 199, 44, 0.2)',
          zIndex: theme.zIndex.appBar,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          minHeight: { xs: 64, sm: 72 },
          px: { xs: 2, sm: 3 },
        }}>
          {/* Left Corner: GG Wi-Fi Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                }}
              >
                {/* Logo Icon */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(255, 199, 44, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 32px rgba(255, 199, 44, 0.4)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: '#000000',
                      fontSize: '1.5rem',
                    }}
                  >
                    GG
                  </Typography>
                </Box>

                {/* Logo Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #FFC72C 0%, #0072CE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#000000',
                      display: { xs: 'none', sm: 'block' },
                      fontSize: '1.8rem',
                    }}
                  >
                    GG Wi-Fi
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          </Box>

          {/* Right Corner: Interactive Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <IconButton
                size="medium"
                sx={{
                  background: 'rgba(248, 249, 250, 0.8)',
                  color: '#0072CE',
                  border: '1px solid rgba(0, 114, 206, 0.2)',
                  '&:hover': {
                    background: 'rgba(0, 114, 206, 0.1)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LanguageIcon />
              </IconButton>
            </motion.div>

            {/* Contact Support Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <IconButton
                size="medium"
                onClick={onContactSupportClick}
                sx={{
                  background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                  color: '#FFFFFF',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0056A3 0%, #004080 100%)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 32px rgba(0, 114, 206, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 114, 206, 0.3)',
                }}
              >
                <ChatIcon />
              </IconButton>
            </motion.div>

            {/* WhatsApp Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <IconButton
                size="medium"
                onClick={() => onWhatsApp('0742844024')}
                sx={{
                  background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                  color: '#000000',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 32px rgba(255, 199, 44, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(255, 199, 44, 0.3)',
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </motion.div>

            {/* Coverage Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <IconButton
                size="medium"
                onClick={onCoverageClick}
                sx={{
                  background: 'rgba(26, 188, 156, 0.1)',
                  color: '#1ABC9C',
                  border: '1px solid rgba(26, 188, 156, 0.2)',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    background: 'rgba(26, 188, 156, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 32px rgba(26, 188, 156, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LocationIcon />
              </IconButton>
            </motion.div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: '#000000',
                    '&:hover': {
                      background: 'rgba(255, 199, 44, 0.1)',
                    },
                  }}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 72,
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 199, 44, 0.2)',
              zIndex: theme.zIndex.appBar - 1,
              padding: '20px',
            }}
          >
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                  color: '#FFFFFF',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Contact Support
              </Button>
              
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                  color: '#000000',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                WhatsApp Support
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                fullWidth
                sx={{
                  borderColor: '#1ABC9C',
                  color: '#1ABC9C',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Coverage Map
              </Button>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;