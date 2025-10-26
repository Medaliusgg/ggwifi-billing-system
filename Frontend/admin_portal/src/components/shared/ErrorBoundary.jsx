import React from 'react';
import { Box, Typography, Button, Avatar, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Error as ErrorIcon, Refresh as RefreshIcon, Security as SecurityIcon } from '@mui/icons-material';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            background: ggwifiTheme.gradients.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              sx={{
                maxWidth: 500,
                width: '100%',
                background: ggwifiTheme.gradients.card,
                borderRadius: ggwifiTheme.borderRadius.lg,
                boxShadow: ggwifiTheme.shadows.golden,
                border: `1px solid rgba(245, 183, 0, 0.2)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Golden Accent Border */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: ggwifiTheme.gradients.primary,
                }}
              />
              
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                {/* GG Wi-Fi Logo */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: ggwifiTheme.gradients.primary,
                      color: ggwifiTheme.colors.secondary,
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      boxShadow: ggwifiTheme.shadows.golden,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    GG
                  </Avatar>
                </motion.div>

                {/* Error Icon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <ErrorIcon
                    sx={{
                      fontSize: 64,
                      color: ggwifiTheme.colors.error,
                      mb: 2,
                    }}
                  />
                </motion.div>

                {/* Error Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: ggwifiTheme.typography.fontFamily.primary,
                      fontWeight: ggwifiTheme.typography.fontWeight.bold,
                      color: ggwifiTheme.colors.error,
                      mb: 2,
                    }}
                  >
                    Oops! Something went wrong
                  </Typography>
                </motion.div>

                {/* Error Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: ggwifiTheme.colors.neutral,
                      fontFamily: ggwifiTheme.typography.fontFamily.primary,
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    We're sorry, but something unexpected happened. Our team has been notified 
                    and is working to fix this issue. Please try refreshing the page.
                  </Typography>
                </motion.div>

                {/* Refresh Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={() => window.location.reload()}
                    sx={{
                      background: ggwifiTheme.gradients.primary,
                      color: ggwifiTheme.colors.secondary,
                      borderRadius: ggwifiTheme.borderRadius.full,
                      padding: `${ggwifiTheme.spacing.md} ${ggwifiTheme.spacing.xl}`,
                      fontSize: ggwifiTheme.typography.fontSize.base,
                      fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                      boxShadow: ggwifiTheme.shadows.golden,
                      textTransform: 'none',
                      '&:hover': {
                        background: ggwifiTheme.gradients.primaryHover,
                        boxShadow: ggwifiTheme.shadows.goldenHover,
                        transform: 'translateY(-2px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    Refresh Page
                  </Button>
                </motion.div>

                {/* GG Wi-Fi Tagline */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 3,
                      color: ggwifiTheme.colors.neutral,
                      fontFamily: ggwifiTheme.typography.fontFamily.primary,
                      fontStyle: 'italic',
                    }}
                  >
                    Powered by GG Wi-Fi - The Signal That Cares
                  </Typography>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;