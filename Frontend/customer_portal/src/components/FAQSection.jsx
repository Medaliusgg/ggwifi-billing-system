import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Wifi as WifiIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const faqs = [
    {
      id: 1,
      question: "How do I purchase an internet package?",
      answer: "You can purchase internet packages through our customer portal. Simply select your preferred package, choose a payment method (M-Pesa, Airtel Money, Mixx, HaloPesa, or T-Pesa), and follow the payment instructions. You'll receive a voucher code via SMS after successful payment.",
      category: "purchase",
      icon: <PaymentIcon />,
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major Tanzanian mobile money services: M-Pesa, Airtel Money, Mixx (Tigo Pesa), HaloPesa, and T-Pesa (TTCL). All payments are processed securely through our SELCOM payment gateway.",
      category: "payment",
      icon: <PaymentIcon />,
    },
    {
      id: 3,
      question: "How do I connect to GGNetworks WiFi?",
      answer: "To connect to GGNetworks WiFi, select 'GGNetworks' from your WiFi settings, enter the voucher code you received via SMS, and you'll be connected instantly. The connection is automatic and secure.",
      category: "connection",
      icon: <WifiIcon />,
    },
    {
      id: 4,
      question: "What internet speeds can I expect?",
      answer: "Our packages offer speeds ranging from 25 Mbps to 200 Mbps depending on your selected plan. Actual speeds may vary based on network conditions and your device capabilities. You can run a speed test through our portal to check your current connection speed.",
      category: "speed",
      icon: <SpeedIcon />,
    },
    {
      id: 5,
      question: "How long do the vouchers last?",
      answer: "Voucher validity depends on your purchased package. We offer daily, weekly, and monthly packages. The voucher expires after the specified time period, and you'll need to purchase a new package to continue using the service.",
      category: "usage",
      icon: <SettingsIcon />,
    },
    {
      id: 6,
      question: "What if I have connection issues?",
      answer: "If you experience connection issues, first try restarting your device and reconnecting. If problems persist, contact our support team via phone, WhatsApp, or email. We provide 24/7 technical support to resolve any connectivity issues.",
      category: "support",
      icon: <SupportIcon />,
    },
    {
      id: 7,
      question: "Is my connection secure?",
      answer: "Yes, all GGNetworks connections are encrypted and secure. We use enterprise-grade security protocols to protect your data and ensure safe browsing. Your personal information and browsing activity are protected.",
      category: "security",
      icon: <SecurityIcon />,
    },
    {
      id: 8,
      question: "Do you offer business packages?",
      answer: "Yes, we offer specialized business packages with higher speeds, priority support, and dedicated bandwidth. Contact our sales team to discuss your business requirements and get a customized solution.",
      category: "business",
      icon: <SettingsIcon />,
    },
    {
      id: 9,
      question: "Can I use multiple devices with one voucher?",
      answer: "Yes, you can connect multiple devices to the same voucher. However, the total bandwidth is shared among all connected devices, so speeds may be affected if many devices are using the connection simultaneously.",
      category: "usage",
      icon: <WifiIcon />,
    },
    {
      id: 10,
      question: "What areas do you cover?",
      answer: "GGNetworks provides coverage across major cities in Tanzania including Dar es Salaam, Arusha, Mwanza, Zanzibar, and other urban areas. Check our coverage map in the portal to see if we serve your location.",
      category: "coverage",
      icon: <WifiIcon />,
    },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'purchase':
        return 'primary';
      case 'payment':
        return 'success';
      case 'connection':
        return 'info';
      case 'speed':
        return 'warning';
      case 'usage':
        return 'secondary';
      case 'support':
        return 'error';
      case 'security':
        return 'success';
      case 'business':
        return 'primary';
      case 'coverage':
        return 'info';
      default:
        return 'primary';
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Find answers to common questions about GGNetworks services
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

      {/* Quick Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Quick Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['purchase', 'payment', 'connection', 'speed', 'support'].map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Chip
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                color={getCategoryColor(category)}
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: `${theme.palette[getCategoryColor(category)].main}`,
                    color: 'white',
                  },
                  transition: 'all 0.3s ease',
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* FAQ Accordion */}
      <Box>
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Accordion
              expanded={expanded === `panel${faq.id}`}
              onChange={handleAccordionChange(`panel${faq.id}`)}
              sx={{
                mb: 2,
                background: theme.custom.gradients.cardBackground,
                border: `1px solid ${theme.custom.effects.glass.primary}`,
                borderRadius: 2,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '16px 0',
                  boxShadow: theme.custom.effects.shadow.medium,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: `${theme.palette[getCategoryColor(faq.category)].main}20`,
                    color: theme.palette[getCategoryColor(faq.category)].main,
                  }}>
                    {faq.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                    {faq.question}
                  </Typography>
                  <Chip
                    label={faq.category}
                    size="small"
                    color={getCategoryColor(faq.category)}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>

      {/* Contact Support Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card sx={{ 
          background: theme.custom.gradients.primary,
          color: 'white',
          mt: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}>
                <SupportIcon sx={{ fontSize: 30 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  Still Need Help?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  Can't find the answer you're looking for? Our support team is here to help 24/7.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Call: 0742844024" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                  <Chip 
                    label="WhatsApp Support" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                  <Chip 
                    label="Email Support" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default FAQSection; 