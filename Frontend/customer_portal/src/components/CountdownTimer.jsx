import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const CountdownTimer = ({ targetTime, onExpire }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setExpired(true);
        if (onExpire) onExpire();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  if (expired) {
    return (
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.error.main,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Session Expired
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main, // Primary Yellow #FFCC00
          color: theme.palette.text.primary, // Deep Black
          borderRadius: '8px',
          padding: '8px 12px',
          minWidth: 60,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {String(timeLeft.hours).padStart(2, '0')}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.9 }}>
          HRS
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
        :
      </Typography>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main, // Primary Yellow #FFCC00
          color: theme.palette.text.primary, // Deep Black
          borderRadius: '8px',
          padding: '8px 12px',
          minWidth: 60,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.9 }}>
          MIN
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
        :
      </Typography>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main, // Primary Yellow #FFCC00
          color: theme.palette.text.primary, // Deep Black
          borderRadius: '8px',
          padding: '8px 12px',
          minWidth: 60,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.9 }}>
          SEC
        </Typography>
      </Box>
    </Box>
  );
};

export default CountdownTimer;
