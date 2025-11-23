import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        borderTop: '1px solid rgba(255, 199, 44, 0.3)',
        py: 3,
        mt: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {currentYear} GG Wi-Fi. All rights reserved.
          </Typography>

          {/* Contact & Social */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => window.open('tel:+255742844024', '_self')}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  color: '#FFC72C',
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
              }}
            >
              <PhoneIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                const message = encodeURIComponent('Hello! I need help with GG Wi-Fi services.');
                window.open(`https://wa.me/255742844024?text=${message}`, '_blank');
              }}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  color: '#25D366',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://facebook.com/ggwifi', '_blank')}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  color: '#1877F2',
                  backgroundColor: 'rgba(24, 119, 242, 0.1)',
                },
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://twitter.com/ggwifi', '_blank')}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  color: '#1DA1F2',
                  backgroundColor: 'rgba(29, 161, 242, 0.1)',
                },
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://instagram.com/ggwifi', '_blank')}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  color: '#E4405F',
                  backgroundColor: 'rgba(228, 64, 95, 0.1)',
                },
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
