import { Card, CardContent, Typography, Box, IconButton, Avatar, Chip, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreVert, Security as SecurityIcon } from '@mui/icons-material';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  onClick,
  loading = false,
  subtitle,
  trend,
  trendValue,
  delay = 0,
  ...props 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return ggwifiTheme.colors.success;
      case 'negative':
        return ggwifiTheme.colors.error;
      default:
        return ggwifiTheme.colors.neutral;
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
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          background: ggwifiTheme.gradients.card,
          borderRadius: ggwifiTheme.borderRadius.lg,
          boxShadow: ggwifiTheme.shadows.lg,
          border: `1px solid rgba(245, 183, 0, 0.1)`,
          cursor: onClick ? 'pointer' : 'default',
          transition: ggwifiTheme.transitions.normal,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: ggwifiTheme.shadows.golden,
            transform: 'translateY(-4px)',
            borderColor: `rgba(245, 183, 0, 0.3)`,
          },
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
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: ggwifiTheme.gradients.primary,
                  color: ggwifiTheme.colors.secondary,
                  boxShadow: ggwifiTheme.shadows.golden,
                }}
              >
                {Icon ? <Icon /> : <SecurityIcon />}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    fontWeight: ggwifiTheme.typography.fontWeight.medium,
                    fontSize: ggwifiTheme.typography.fontSize.sm,
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: ggwifiTheme.colors.neutral,
                      fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {(change || trend) && (
              <Chip
                icon={change ? (ChangeIcon ? <ChangeIcon /> : null) : (trend === 'up' ? <TrendingUp /> : <TrendingDown />)}
                label={change || `${trendValue}%`}
                size="small"
                sx={{
                  backgroundColor: change 
                    ? `rgba(${getChangeColor().replace('#', '')}, 0.1)` 
                    : trend === 'up' 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  color: change 
                    ? getChangeColor() 
                    : trend === 'up' 
                    ? ggwifiTheme.colors.success 
                    : ggwifiTheme.colors.error,
                  border: `1px solid ${change 
                    ? getChangeColor() 
                    : trend === 'up' 
                    ? ggwifiTheme.colors.success 
                    : ggwifiTheme.colors.error}`,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                }}
              />
            )}
          </Box>

          {loading ? (
            <Skeleton variant="text" width="60%" height={40} />
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.bold,
                color: ggwifiTheme.colors.secondary,
                mb: 1,
                background: ggwifiTheme.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {value}
            </Typography>
          )}

          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {ChangeIcon && (
                <ChangeIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: getChangeColor() 
                  }} 
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: getChangeColor(),
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.medium,
                }}
              >
                {change}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;