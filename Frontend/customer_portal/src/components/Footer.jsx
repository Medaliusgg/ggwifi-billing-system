import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Link, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  useTheme,
  Grid,
  IconButton,
  Divider,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = ({ currentLanguage }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const currentYear = new Date().getFullYear();

  const qafItems = [
    {
      id: 'panel1',
      question: 'How do I purchase internet packages?',
      answer: 'You can purchase packages through our customer portal by clicking "Buy Package" and selecting your preferred plan. Payment can be made via M-Pesa, Tigo Pesa, Airtel Money, or Halopesa.',
    },
    {
      id: 'panel2',
      question: 'How do I redeem a voucher code?',
      answer: 'Enter your 6-character voucher code and phone number in the "Voucher Login" section. Once verified, you\'ll be connected to our high-speed internet network.',
    },
    {
      id: 'panel3',
      question: 'How can I monitor my data usage?',
      answer: 'Log into your account to view real-time data usage, remaining balance, and connection history. You can also receive SMS notifications about your usage.',
    },
    {
      id: 'panel4',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major mobile money services in Tanzania including M-Pesa, Tigo Pesa, Airtel Money, and Halopesa. All transactions are secure and encrypted.',
    },
    {
      id: 'panel5',
      question: 'How do I contact customer support?',
      answer: 'Contact us 24/7 via WhatsApp, phone call, or live chat. Our support team is always ready to help with any technical issues or questions.',
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, color: '#1877F2', href: '#' },
    { icon: <TwitterIcon />, color: '#1DA1F2', href: '#' },
    { icon: <InstagramIcon />, color: '#E4405F', href: '#' },
    { icon: <LinkedInIcon />, color: '#0A66C2', href: '#' },
  ];

  const features = [
    { icon: <CheckCircleIcon />, text: '24/7 Support' },
    { icon: <CheckCircleIcon />, text: 'Secure Connection' },
    { icon: <CheckCircleIcon />, text: 'Fast Speeds' },
    { icon: <CheckCircleIcon />, text: 'Wide Coverage' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box
      component="footer"
      sx={{
        background: `
          linear-gradient(135deg, #000000 0%, #1a1a1a 100%),
          radial-gradient(circle at 20% 20%, rgba(255, 199, 44, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 114, 206, 0.1) 0%, transparent 50%)
        `,
        color: '#FFFFFF',
        py: 8,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #FFC72C 50%, transparent 100%)',
        },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* QAF Section */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 8 }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Chip
                  icon={<StarIcon />}
                  label="Frequently Asked Questions"
                  sx={{
                    background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                    color: '#000000',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    fontSize: '1.1rem',
                    mb: 2,
                    '& .MuiChip-icon': {
                      color: '#000000',
                    },
                  }}
                />
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                  }}
                >
                  Got Questions? We Have Answers
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {qafItems.map((item, index) => (
                  <Grid item xs={12} md={6} key={item.id}>
                    <Accordion
                      expanded={expanded === item.id}
                      onChange={handleChange(item.id)}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        mb: 2,
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': {
                          background: 'rgba(255, 199, 44, 0.1)',
                          border: '1px solid rgba(255, 199, 44, 0.3)',
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon 
                            sx={{ 
                              color: expanded === item.id ? '#FFC72C' : '#FFFFFF',
                              transition: 'color 0.3s ease',
                            }} 
                          />
                        }
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            margin: '16px 0',
                          },
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#FFFFFF',
                            fontSize: '1.1rem',
                          }}
                        >
                          {item.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6,
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 6 }} />

          {/* Main Footer Content */}
          <Grid container spacing={6} sx={{ mb: 6 }}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, color: '#000000' }}>GG</Typography>
                    </Avatar>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #FFC72C 0%, #0072CE 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      GG Wi-Fi
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3, lineHeight: 1.6 }}>
                    Tanzania's leading internet service provider, connecting communities with reliable, 
                    fast, and affordable WiFi solutions across the country.
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={feature.icon}
                        label={feature.text}
                        size="small"
                        sx={{
                          background: 'rgba(255, 199, 44, 0.1)',
                          color: '#FFC72C',
                          border: '1px solid rgba(255, 199, 44, 0.2)',
                          '& .MuiChip-icon': {
                            color: '#FFC72C',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 3 }}>
                  Contact Information
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      sx={{
                        background: 'rgba(255, 199, 44, 0.1)',
                        color: '#FFC72C',
                        '&:hover': {
                          background: 'rgba(255, 199, 44, 0.2)',
                        },
                      }}
                    >
                      <PhoneIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        +255 742 844 024
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        24/7 Support
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      sx={{
                        background: 'rgba(0, 114, 206, 0.1)',
                        color: '#0072CE',
                        '&:hover': {
                          background: 'rgba(0, 114, 206, 0.2)',
                        },
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        support@ggwifi.co.tz
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Email Support
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      sx={{
                        background: 'rgba(26, 188, 156, 0.1)',
                        color: '#1ABC9C',
                        '&:hover': {
                          background: 'rgba(26, 188, 156, 0.2)',
                        },
                      }}
                    >
                      <LocationIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Dar es Salaam, Tanzania
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Headquarters
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </motion.div>
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 3 }}>
                  Follow Us
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: social.color,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          background: social.color,
                          color: '#FFFFFF',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 24px ${social.color}40`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>

                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                  Stay connected with us for the latest updates and offers.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

          {/* Bottom Footer */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {/* Copyright */}
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Copyright © {currentYear} GG Wi-Fi. All rights reserved.
              </Typography>

              {/* Links */}
              <Stack direction="row" spacing={4}>
                <Link
                  href="/terms"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#FFC72C',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#FFC72C',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/support"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#FFC72C',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Support
                </Link>
              </Stack>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;