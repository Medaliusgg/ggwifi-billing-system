import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  Wifi as WifiIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  SignalCellular4Bar as SignalIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Public as PublicIcon,
  LocationCity as CityIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  LocalAirport as AirportIcon,
  LocalMall as MallIcon,
  LocalHotel as HotelIcon,
  LocalGasStation as GasStationIcon,
  LocalParking as ParkingIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Analytics as AnalyticsIcon,
  QuestionAnswer as FAQIcon,
  HowToReg as HowToIcon,
  RateReview as TestimonialsIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import VoucherAuthentication from './VoucherAuthentication';
import InternetPackages from './InternetPackages';
import CustomerTestimonials from './CustomerTestimonials';
import FAQSection from './FAQSection';
import HowItWorks from './HowItWorks';
import LanguageSelector from './LanguageSelector';
import MobileBottomNavigation from './MobileBottomNavigation';
import ResponsiveLayout from './ResponsiveLayout';
import MobileTabContent from './MobileTabContent';
import LandingPage from './LandingPage';
import QuickConnect from './QuickConnect';
import SignUp from './SignUp';
import PinLogin from './PinLogin';
import ForgotPin from './ForgotPin';
import { useData } from '../context/DataContext';
import { getTranslation } from '../translations';
import authService from '../services/authService';

const CustomerPortal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'voucher', 'packages', 'signup', 'login', 'forgot-pin'

  // Use preloaded data from context
  const { 
    coverageAreas, 
    isLoadingCoverage, 
    coverageError,
    refetchCoverage 
  } = useData();

  // Function to get appropriate icon based on city type
  const getCityIcon = (cityType, cityName) => {
    const type = cityType?.toLowerCase() || '';
    const name = cityName?.toLowerCase() || '';
    
    if (type.includes('city') || name.includes('dar es salaam') || name.includes('arusha')) {
      return <CityIcon />;
    }
    if (type.includes('residential') || type.includes('apartment')) {
      return <ApartmentIcon />;
    }
    if (type.includes('business') || type.includes('commercial')) {
      return <BusinessIcon />;
    }
    if (type.includes('mall') || type.includes('shopping')) {
      return <MallIcon />;
    }
    if (type.includes('hotel') || type.includes('accommodation')) {
      return <HotelIcon />;
    }
    if (type.includes('school') || type.includes('education')) {
      return <SchoolIcon />;
    }
    if (type.includes('hospital') || type.includes('medical')) {
      return <HospitalIcon />;
    }
    if (type.includes('airport') || type.includes('transport')) {
      return <AirportIcon />;
    }
    if (type.includes('store') || type.includes('retail')) {
      return <StoreIcon />;
    }
    if (type.includes('gas') || type.includes('fuel')) {
      return <GasStationIcon />;
    }
    if (type.includes('parking') || type.includes('transport')) {
      return <ParkingIcon />;
    }
    if (type.includes('home') || type.includes('residential')) {
      return <HomeIcon />;
    }
    
    // Default icons based on city name
    if (name.includes('dar es salaam')) {
      return <CityIcon />;
    }
    if (name.includes('arusha')) {
      return <CityIcon />;
    }
    
    return <PublicIcon />;
  };

  // Function to get gradient for city type
  const getCityGradient = (cityType) => {
    const type = cityType?.toLowerCase() || '';
    
    if (type.includes('city')) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    if (type.includes('business') || type.includes('commercial')) {
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    }
    if (type.includes('residential')) {
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    if (type.includes('mall') || type.includes('shopping')) {
      return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    }
    if (type.includes('hotel')) {
      return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    }
    if (type.includes('school') || type.includes('education')) {
      return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    }
    if (type.includes('hospital') || type.includes('medical')) {
      return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
    }
    
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCoverageClick = () => {
    setShowCoverageModal(true);
  };

  const handleCloseCoverageModal = () => {
    setShowCoverageModal(false);
  };

  const handlePhoneCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual theme switching logic
  };

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const handleNavigateToVoucher = () => {
    setCurrentView('voucher');
  };

  const handleNavigateToPackages = () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      setCurrentView('login');
      return;
    }
    setCurrentView('packages');
  };

  const handleNavigateToSignUp = () => {
    setCurrentView('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentView('login');
  };

  const handleNavigateToForgotPin = () => {
    setCurrentView('forgot-pin');
  };

  const handleLoginSuccess = (response) => {
    setCurrentView('packages'); // Navigate to packages after login
  };

  const handleSignUpSuccess = (response) => {
    // After signup, user gets free trial - navigate to packages
    setCurrentView('packages');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <ResponsiveLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      currentLanguage={currentLanguage}
      isDarkMode={isDarkMode}
      onThemeToggle={handleThemeToggle}
      onLanguageChange={handleLanguageChange}
      onPhoneCall={handlePhoneCall}
      onWhatsApp={handleWhatsApp}
      onCoverageClick={handleCoverageClick}
      showCoverageModal={showCoverageModal}
      onCloseCoverageModal={handleCloseCoverageModal}
      coverageAreas={coverageAreas}
      isLoadingCoverage={isLoadingCoverage}
      coverageError={coverageError}
      refetchCoverage={refetchCoverage}
      getCityIcon={getCityIcon}
      getCityGradient={getCityGradient}
      handlePhoneCall={handlePhoneCall}
      handleWhatsApp={handleWhatsApp}
      handleEmail={handleEmail}
      handleThemeToggle={handleThemeToggle}
      handleLanguageChange={handleLanguageChange}
      handleCoverageClick={handleCoverageClick}
      handleCloseCoverageModal={handleCloseCoverageModal}
    >
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.custom.gradients.backgroundPrimary,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        },
        '@keyframes gradientShift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
      }}
    >
      {/* Top Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: theme.custom.gradients.backgroundSecondary,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.custom.effects.shadow.heavy,
          borderBottom: `1px solid ${theme.custom.effects.glass.primary}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/logo.svg" 
                alt="GGNetworks Logo" 
                style={{ 
                  height: '40px',
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }} 
              />
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <LanguageSelector 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={handleThemeToggle}
                    icon={<LightModeIcon />}
                    checkedIcon={<DarkModeIcon />}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IconButton 
                size="medium" 
                onClick={() => handlePhoneCall('0742844024')}
                sx={{ 
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                }}
              >
                <PhoneIcon />
              </IconButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <IconButton 
                size="medium" 
                onClick={() => handleWhatsApp('0742844024')}
                sx={{ 
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={handleCoverageClick}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {getTranslation(currentLanguage, 'coverage')}
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <Box sx={{ height: '64px' }} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onNavigateToVoucher={handleNavigateToVoucher}
              onNavigateToPackages={handleNavigateToPackages}
              onNavigateToSignUp={handleNavigateToSignUp}
              onNavigateToLogin={handleNavigateToLogin}
              currentLanguage={currentLanguage}
            />
          </motion.div>
        )}

        {currentView === 'voucher' && (
            <motion.div
            key="voucher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            >
            <Box sx={{ py: 4 }}>
              <QuickConnect onBack={handleBackToLanding} />
            </Box>
            </motion.div>
        )}

        {currentView === 'packages' && (
          <motion.div
            key="packages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ py: 4 }}>
              <InternetPackages />
        </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {currentView === 'packages' && (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
        >
            <Button
              variant="contained"
              size="large"
              onClick={handleNavigateToVoucher}
              startIcon={<WifiIcon />}
            sx={{
                background: theme.custom.gradients.primary,
                borderRadius: '50px',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: theme.custom.gradients.primary,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
              Connect Voucher
            </Button>
          </motion.div>
        )}

        {currentView === 'voucher' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleNavigateToPackages}
              startIcon={<ShoppingCartIcon />}
                sx={{
                background: theme.custom.gradients.success,
                borderRadius: '50px',
                px: 3,
                py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                  background: theme.custom.gradients.success,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
                },
              }}
              >
              View Packages
            </Button>
              </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Coverage Modal */}
      <Dialog
        open={showCoverageModal}
        onClose={handleCloseCoverageModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>
                {getTranslation(currentLanguage, 'coverageAreasTitle')}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleCloseCoverageModal}
              sx={{ 
                color: theme.palette.grey[600],
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {isLoadingCoverage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : coverageError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getTranslation(currentLanguage, 'failedToLoad')}
              <Button 
                onClick={() => refetchCoverage()} 
                sx={{ ml: 2 }}
                size="small"
              >
                {getTranslation(currentLanguage, 'retry')}
              </Button>
            </Alert>
          ) : coverageAreas && coverageAreas.length > 0 ? (
            <>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {getTranslation(currentLanguage, 'coverageAreasTitle')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                  {getTranslation(currentLanguage, 'coverageDescription')}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    mx: 'auto',
                    mb: 3,
                  }}
                />
              </Box>
              
              {coverageAreas.map((city, cityIndex) => (
                <Box key={city.id} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: cityIndex * 0.1 }}
                    >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: getCityGradient(city.type),
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -2,
                          left: -2,
                          right: -2,
                          bottom: -2,
                      borderRadius: '50%',
                          background: getCityGradient(city.type),
                          opacity: 0.3,
                          zIndex: -1,
                          filter: 'blur(4px)',
                        },
                      }}>
                        <Box sx={{
                          color: 'white',
                          fontSize: 24,
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                        }}>
                          {getCityIcon(city.type, city.name)}
                        </Box>
                    </Box>
                    </motion.div>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{
                          background: getCityGradient(city.type),
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 0.5,
                        }}
                      >
                      {city.name}
                    </Typography>
                    <Chip 
                      label={city.type} 
                      size="small" 
                        sx={{ 
                          background: getCityGradient(city.type),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {city.areas && city.areas.map((area, areaIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={areaIndex}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: areaIndex * 0.1 }}
                        >
                          <Card 
                            sx={{ 
                               height: 320, // Fixed height for consistent card size
                              transition: 'all 0.3s ease-in-out',
                               background: theme.custom.gradients.cardBackground,
                              '&:hover': {
                                 transform: 'translateY(-8px)',
                                 boxShadow: theme.custom.effects.shadow.heavy,
                                 background: theme.custom.gradients.backgroundSecondary,
                              },
                               border: `1px solid ${theme.custom.effects.glass.primary}`,
                               display: 'flex',
                               flexDirection: 'column',
                            }}
                          >
                            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600} sx={{ 
                                  color: theme.palette.primary.main,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}>
                                  {area.name}
                                </Typography>
                                <Chip 
                                  label={area.status} 
                                  size="small" 
                                  color="success" 
                                  sx={{ 
                                    fontSize: '0.7rem',
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              
                              <Box sx={{ mb: 2, flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                  <LocationIcon sx={{ 
                                    fontSize: 16, 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {area.address}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                  <SignalIcon sx={{ 
                                    fontSize: 16, 
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {area.speed || 'Up to 100 Mbps'}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <TimeIcon sx={{ 
                                    fontSize: 16, 
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Coverage: {area.coverage || 'Good'}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePhoneCall(area.phone)}
                                  sx={{
                                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                      filter: 'brightness(1.1)',
                                      transform: 'scale(1.1)',
                                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                                  }}
                                >
                                  <PhoneIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                
                                <IconButton
                                  size="small"
                                  onClick={() => handleWhatsApp(area.whatsapp)}
                                  sx={{
                                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                      filter: 'brightness(1.1)',
                                      transform: 'scale(1.1)',
                                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                                  }}
                                >
                                  <WhatsAppIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                
                                <IconButton
                                  size="small"
                                  onClick={() => handleEmail(area.email)}
                                  sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      filter: 'brightness(1.1)',
                                      transform: 'scale(1.1)',
                                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                  }}
                                >
                                  <EmailIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </>
          ) : (
            <Alert severity="info">
              {getTranslation(currentLanguage, 'noCoverageAvailable')}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseCoverageModal}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {getTranslation(currentLanguage, 'close')}
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
    </ResponsiveLayout>
  );
};

export default CustomerPortal; 