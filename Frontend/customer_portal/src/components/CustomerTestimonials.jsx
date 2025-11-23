import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Rating,
  Chip,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  FormatQuote as QuoteIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CustomerTestimonials = () => {
  const theme = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mwangi",
      location: "Dar es Salaam",
      type: "Business Owner",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "GGNetworks has transformed our business operations. The reliable internet connection has improved our customer service and productivity significantly. Highly recommended!",
      category: "business",
      business: "Tech Solutions Ltd",
      speed: "100 Mbps",
      usage: "Heavy business use",
      duration: "2 years",
    },
    {
      id: 2,
      name: "John Kimani",
      location: "Arusha",
      type: "Student",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "As a student, I need fast internet for my online classes. GGNetworks provides excellent speed and reliability. Perfect for my studies!",
      category: "education",
      business: "University of Arusha",
      speed: "50 Mbps",
      usage: "Online learning",
      duration: "1 year",
    },
    {
      id: 3,
      name: "Fatima Hassan",
      location: "Mwanza",
      type: "Home User",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "The customer service is outstanding! When I had an issue, they resolved it within hours. The internet speed is consistently fast.",
      category: "residential",
      business: "Home User",
      speed: "25 Mbps",
      usage: "Streaming & browsing",
      duration: "6 months",
    },
    {
      id: 4,
      name: "David Ochieng",
      location: "Nairobi",
      type: "Remote Worker",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "Working from home requires stable internet. GGNetworks delivers exactly what I need - fast, reliable, and affordable service.",
      category: "business",
      business: "Freelance Developer",
      speed: "75 Mbps",
      usage: "Remote work",
      duration: "1.5 years",
    },
    {
      id: 5,
      name: "Amina Yusuf",
      location: "Zanzibar",
      type: "Hotel Manager",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "Our hotel guests love the fast WiFi. GGNetworks has helped us provide excellent service and improve guest satisfaction.",
      category: "business",
      business: "Beach Resort Hotel",
      speed: "200 Mbps",
      usage: "Hotel WiFi",
      duration: "3 years",
    },
    {
      id: 6,
      name: "Peter Njoroge",
      location: "Kisumu",
      type: "Small Business",
      rating: 5,
      image: "/api/placeholder/60/60",
      quote: "Affordable pricing with premium service. GGNetworks has been our internet provider for years and never disappoints.",
      category: "business",
      business: "Local Restaurant",
      speed: "50 Mbps",
      usage: "Business operations",
      duration: "2.5 years",
    },
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'business':
        return <BusinessIcon />;
      case 'education':
        return <SchoolIcon />;
      case 'residential':
        return <HomeIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'business':
        return 'primary';
      case 'education':
        return 'success';
      case 'residential':
        return 'info';
      default:
        return 'primary';
    }
  };

  const handleTestimonialClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowTestimonialModal(true);
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            What Our Customers Say
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Real stories from satisfied customers across Tanzania
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              background: theme.custom.gradients.primary,
              borderRadius: 2,
              mx: 'auto',
              mb: 3,
            }}
          />
        </motion.div>
      </Box>

      {/* Featured Testimonial */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ 
          background: theme.custom.gradients.cardBackground,
          border: `1px solid ${theme.custom.effects.glass.primary}`,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: theme.custom.gradients.primary,
          },
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={testimonials[currentTestimonial].image}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  border: `3px solid ${theme.palette.primary.main}`,
                }}
              >
                {testimonials[currentTestimonial].name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {testimonials[currentTestimonial].name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {testimonials[currentTestimonial].location}
                  </Typography>
                </Box>
                <Chip 
                  icon={getCategoryIcon(testimonials[currentTestimonial].category)}
                  label={testimonials[currentTestimonial].type}
                  color={getCategoryColor(testimonials[currentTestimonial].category)}
                  size="small"
                />
              </Box>
              <Rating 
                value={testimonials[currentTestimonial].rating} 
                readOnly 
                sx={{ color: 'warning.main' }}
              />
            </Box>
            
            <Box sx={{ position: 'relative', mb: 3 }}>
              <QuoteIcon sx={{ 
                fontSize: 40, 
                color: theme.palette.primary.main,
                opacity: 0.3,
                position: 'absolute',
                top: -10,
                left: -10,
              }} />
              <Typography variant="h6" sx={{ 
                fontStyle: 'italic',
                lineHeight: 1.6,
                pl: 4,
                color: 'text.primary',
              }}>
                "{testimonials[currentTestimonial].quote}"
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`${testimonials[currentTestimonial].speed}`}
                  size="small"
                  color="success"
                />
                <Chip 
                  label={testimonials[currentTestimonial].duration}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={handlePrevious}
                  sx={{ 
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton 
                  onClick={handleNext}
                  sx={{ 
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Testimonials Grid */}
      <Grid container spacing={3}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  background: theme.custom.gradients.cardBackground,
                  border: `1px solid ${theme.custom.effects.glass.primary}`,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.custom.effects.shadow.heavy,
                  }
                }}
                onClick={() => handleTestimonialClick(testimonial)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={testimonial.image}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                    <Rating 
                      value={testimonial.rating} 
                      readOnly 
                      size="small"
                      sx={{ color: 'warning.main' }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: 'italic',
                      mb: 2,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      icon={getCategoryIcon(testimonial.category)}
                      label={testimonial.type}
                      color={getCategoryColor(testimonial.category)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {testimonial.duration}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Testimonial Detail Modal */}
      <Dialog
        open={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        maxWidth="md"
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QuoteIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700}>
              Customer Testimonial
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedTestimonial && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={selectedTestimonial.image}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mr: 3,
                    border: `4px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {selectedTestimonial.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                    {selectedTestimonial.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedTestimonial.business}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedTestimonial.location}
                    </Typography>
                  </Box>
                  <Rating 
                    value={selectedTestimonial.rating} 
                    readOnly 
                    sx={{ color: 'warning.main' }}
                  />
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ 
                fontStyle: 'italic',
                lineHeight: 1.6,
                mb: 3,
                color: 'text.primary',
              }}>
                "{selectedTestimonial.quote}"
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      {selectedTestimonial.speed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Internet Speed
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                      {selectedTestimonial.usage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usage Type
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowTestimonialModal(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerTestimonials; 