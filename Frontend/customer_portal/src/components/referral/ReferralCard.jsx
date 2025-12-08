import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { customerPortalAPI } from '../../services/customerPortalApi';
import { toast } from 'react-hot-toast';

/**
 * ReferralCard Component
 * Displays user's referral code with share functionality
 */
const ReferralCard = () => {
  const [copied, setCopied] = useState(false);

  const referralQuery = useQuery(
    ['referral-code'],
    async () => {
      const res = await customerPortalAPI.getReferralCode();
      return res?.data || res;
    },
    { retry: 1 }
  );

  const statsQuery = useQuery(
    ['referral-stats'],
    async () => {
      const res = await customerPortalAPI.getReferralStats();
      return res?.data?.stats || {};
    },
    { retry: 1 }
  );

  const referralCode = referralQuery.data?.referralCode;
  const shareUrl = referralQuery.data?.shareUrl;
  const shareMessage = referralQuery.data?.shareMessage;
  const stats = statsQuery.data || {};

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (shareMessage) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join GG WiFi',
            text: shareMessage,
            url: shareUrl || 'https://ggwifi.co.tz',
          });
        } catch (err) {
          // User cancelled or error
          console.log('Share cancelled');
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareMessage);
        toast.success('Referral message copied!');
      }
    }
  };

  if (referralQuery.isLoading) {
    return (
      <Card sx={{ borderRadius: '18px', background: '#FFFFFF', border: '1px solid #FFE89C' }}>
        <CardContent>
          <Typography>Loading referral code...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (referralQuery.error || !referralCode) {
    return null; // Don't show if error or no code
  }

  return (
    <Card
      sx={{
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #FFF9C4 0%, #FFE89C 100%)',
        border: '2px solid #F2C94C',
        boxShadow: '0 4px 16px rgba(242, 201, 76, 0.3)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={700} color="#0A0A0A" gutterBottom>
              🎁 Referral Program
            </Typography>
            <Typography variant="body2" color="#666666">
              Share your code and earn GG Points when friends sign up!
            </Typography>
          </Box>

          {/* Referral Code */}
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '2px solid #F2C94C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="#666666" display="block" mb={0.5}>
                Your Referral Code
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color="#0A0A0A"
                fontFamily="monospace"
                sx={{ letterSpacing: 2 }}
              >
                {referralCode}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Copy code">
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    background: '#F2C94C',
                    color: '#0A0A0A',
                    '&:hover': { background: '#E0B335' },
                  }}
                >
                  {copied ? <CheckCircleIcon /> : <CopyIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    background: '#0A0A0A',
                    color: '#FFFFFF',
                    '&:hover': { background: '#1A1A1A' },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Stats */}
          {(stats.totalReferrals > 0 || stats.activeReferrals > 0) && (
            <Stack direction="row" spacing={2}>
              <Chip
                icon={<PeopleIcon />}
                label={`${stats.totalReferrals || 0} Referrals`}
                sx={{
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<FavoriteIcon />}
                label={`${stats.totalRewardPoints || 0} Points Earned`}
                sx={{
                  background: '#FFFFFF',
                  color: '#F2C94C',
                  fontWeight: 600,
                }}
              />
            </Stack>
          )}

          {/* Info */}
          <Box
            sx={{
              p: 2,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <Typography variant="caption" color="#666666" display="block">
              💡 <strong>How it works:</strong> Share your code. When a friend signs up and makes their first purchase, you both earn GG Points!
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;

