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
        background: '#F2C94C',  // Official gold background
        py: 4,
        mt: 'auto',
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
              color: '#0A0A0A',
              textAlign: { xs: 'center', sm: 'left' },
              fontWeight: 500,
            }}
          >
            © {currentYear} GG Wi-Fi. All rights reserved.
          </Typography>

          {/* Contact & Social */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => window.open('tel:+255742844024', '_self')}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
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
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://facebook.com/ggwifi', '_blank')}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://twitter.com/ggwifi', '_blank')}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              onClick={() => window.open('https://instagram.com/ggwifi', '_blank')}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
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
