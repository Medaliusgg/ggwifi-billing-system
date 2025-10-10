import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreVert } from '@mui/icons-material';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  onClick,
  loading = false,
  ...props 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return '#4CAF50';
      case 'negative':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return TrendingUp;
    if (changeType === 'negative') return TrendingDown;
    return null;
  };

  const ChangeIcon = getChangeIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="card hover:shadow-gg-glow cursor-pointer transition-all duration-300"
        onClick={onClick}
        sx={{
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          borderRadius: 3,
          '&:hover': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          },
        }}
        {...props}
      >
        <CardContent className="p-6">
          <Box className="flex items-center justify-between mb-4">
            <Box
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              sx={{
                backgroundColor: color === 'primary' ? '#FFD70020' : '#FFD70010',
                border: `1px solid ${color === 'primary' ? '#FFD70040' : '#FFD70020'}`,
              }}
            >
              {Icon && (
                <Icon
                  className={color === 'primary' ? 'text-gg-gold' : 'text-gg-text-secondary'}
                  sx={{ fontSize: 24 }}
                />
              )}
            </Box>
            <IconButton
              size="small"
              className="text-gg-text-muted hover:text-gg-gold"
              onClick={(e) => {
                e.stopPropagation();
                // Handle menu actions
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          <Box className="space-y-2">
            <Typography
              variant="h4"
              className="text-gg-text-primary font-bold"
            >
              {loading ? '...' : value}
            </Typography>
            
            <Typography
              variant="body2"
              className="text-gg-text-secondary"
            >
              {title}
            </Typography>

            {change && (
              <Box className="flex items-center space-x-1 mt-3">
                {ChangeIcon && (
                  <ChangeIcon
                    sx={{ 
                      fontSize: 16, 
                      color: getChangeColor(),
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  sx={{ color: getChangeColor() }}
                  className="font-medium"
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
