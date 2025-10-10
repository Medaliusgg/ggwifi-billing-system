import React from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Language as LanguageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    {
      code: 'sw',
      name: 'Swahili',
      nativeName: 'Kiswahili',
      flag: '🇹🇿',
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    handleClose();
  };



  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.custom.effects.glass.primary}`,
            color: theme.palette.primary.main,
            width: 48,
            height: 48,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <LanguageIcon />
        </IconButton>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.custom.effects.glass.primary}`,
            borderRadius: 2,
            boxShadow: theme.custom.effects.shadow.heavy,
            minWidth: 200,
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.3)',
                },
              },
            }}
          >
            <ListItemIcon>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {language.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText
              primary={language.nativeName}
              secondary={language.name}
              primaryTypographyProps={{
                fontWeight: currentLanguage === language.code ? 600 : 400,
                color: currentLanguage === language.code ? 'primary.main' : 'text.primary',
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector; 