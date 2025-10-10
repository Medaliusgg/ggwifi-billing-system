import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Company Information API
export const companyAPI = {
  getCompanyInfo: () => apiClient.get('/public/company-info'),
  getCompanyServices: () => apiClient.get('/public/company/services'),
  getCompanyContact: () => apiClient.get('/public/company/contact'),
  getCompanyAbout: () => apiClient.get('/public/company/about'),
};

// Package Information API
export const packageAPI = {
  getAllPackages: () => apiClient.get('/public/packages'),
  getPackagesByType: (type) => apiClient.get(`/public/packages/${type}`),
  getActivePackages: () => apiClient.get('/public/packages/active'),
  getPackageById: (packageId) => apiClient.get(`/public/packages/${packageId}`),
  getPopularPackages: () => apiClient.get('/public/packages/popular'),
  getPackageComparison: () => apiClient.get('/public/packages/comparison'),
};

// Promotion & Marketing API
export const promotionAPI = {
  getActivePromotions: () => apiClient.get('/public/promotions'),
  getPromotionById: (promotionId) => apiClient.get(`/public/promotions/${promotionId}`),
  getPromotionsByType: (type) => apiClient.get(`/public/promotions/type/${type}`),
  getFeaturedPromotions: () => apiClient.get('/public/promotions/featured'),
};

// Blog & Content API
export const blogAPI = {
  getBlogPosts: (params = {}) => apiClient.get('/public/blog', { params }),
  getBlogPostById: (postId) => apiClient.get(`/public/blog/${postId}`),
  getBlogCategories: () => apiClient.get('/public/blog/categories'),
  getBlogPostsByCategory: (category) => apiClient.get(`/public/blog/category/${category}`),
  getFeaturedPosts: () => apiClient.get('/public/blog/featured'),
  searchBlogPosts: (query) => apiClient.get('/public/blog/search', { params: { q: query } }),
};

// Contact & Feedback API
export const contactAPI = {
  submitContactMessage: (messageData) => apiClient.post('/public/contact', messageData),
  submitFeedback: (feedbackData) => apiClient.post('/public/feedback', feedbackData),
  getContactInfo: () => apiClient.get('/public/contact/info'),
  getSupportCategories: () => apiClient.get('/public/support/categories'),
  submitSupportTicket: (ticketData) => apiClient.post('/public/support/tickets', ticketData),
};

// Application Forms API
export const applicationAPI = {
  submitApplicationForm: (applicationData) => apiClient.post('/public/application', applicationData),
  getApplicationStatus: (applicationId) => apiClient.get(`/public/application/${applicationId}/status`),
  getApplicationFormFields: () => apiClient.get('/public/application/fields'),
  validateApplicationData: (applicationData) => apiClient.post('/public/application/validate', applicationData),
  getApplicationTypes: () => apiClient.get('/public/application/types'),
};

// OTP & Registration API
export const otpAPI = {
  generateRegistrationOtp: (phoneNumber) => apiClient.post('/public/otp/generate', { phoneNumber }),
  validateRegistrationOtp: (otpData) => apiClient.post('/public/otp/validate', otpData),
  resendRegistrationOtp: (phoneNumber) => apiClient.post('/public/otp/resend', { phoneNumber }),
  checkPhoneNumberAvailability: (phoneNumber) => apiClient.get(`/public/otp/check-availability/${phoneNumber}`),
};

// Coverage & Location API
export const coverageAPI = {
  getAllCoverageAreas: () => apiClient.get('/public/coverage-areas'),
  getCoverageAreasByCity: (city) => apiClient.get(`/public/coverage-areas/city/${city}`),
  getCoverageAreaById: (id) => apiClient.get(`/public/coverage-areas/${id}`),
  checkCoverageAvailability: (locationData) => apiClient.post('/public/coverage-areas/check', locationData),
  getCoverageCities: () => apiClient.get('/public/coverage-areas/cities'),
  getCoverageStatistics: () => apiClient.get('/public/coverage-areas/statistics'),
};

// Service Information API
export const serviceAPI = {
  getServiceTypes: () => apiClient.get('/public/services/types'),
  getServiceDetails: (serviceType) => apiClient.get(`/public/services/${serviceType}`),
  getServiceFeatures: (serviceType) => apiClient.get(`/public/services/${serviceType}/features`),
  getServicePricing: (serviceType) => apiClient.get(`/public/services/${serviceType}/pricing`),
  getServiceComparison: () => apiClient.get('/public/services/comparison'),
};

// FAQ & Help API
export const faqAPI = {
  getFAQCategories: () => apiClient.get('/public/faq/categories'),
  getFAQByCategory: (category) => apiClient.get(`/public/faq/category/${category}`),
  getAllFAQ: () => apiClient.get('/public/faq'),
  searchFAQ: (query) => apiClient.get('/public/faq/search', { params: { q: query } }),
  getPopularFAQ: () => apiClient.get('/public/faq/popular'),
};

// Testimonials & Reviews API
export const testimonialAPI = {
  getTestimonials: (params = {}) => apiClient.get('/public/testimonials', { params }),
  getTestimonialById: (testimonialId) => apiClient.get(`/public/testimonials/${testimonialId}`),
  getFeaturedTestimonials: () => apiClient.get('/public/testimonials/featured'),
  submitTestimonial: (testimonialData) => apiClient.post('/public/testimonials', testimonialData),
  getTestimonialCategories: () => apiClient.get('/public/testimonials/categories'),
};

// News & Updates API
export const newsAPI = {
  getNews: (params = {}) => apiClient.get('/public/news', { params }),
  getNewsById: (newsId) => apiClient.get(`/public/news/${newsId}`),
  getLatestNews: () => apiClient.get('/public/news/latest'),
  getNewsByCategory: (category) => apiClient.get(`/public/news/category/${category}`),
  getNewsCategories: () => apiClient.get('/public/news/categories'),
};

// Events & Webinars API
export const eventAPI = {
  getEvents: (params = {}) => apiClient.get('/public/events', { params }),
  getEventById: (eventId) => apiClient.get(`/public/events/${eventId}`),
  getUpcomingEvents: () => apiClient.get('/public/events/upcoming'),
  registerForEvent: (eventId, registrationData) => apiClient.post(`/public/events/${eventId}/register`, registrationData),
  getEventCategories: () => apiClient.get('/public/events/categories'),
};

// Downloads & Resources API
export const resourceAPI = {
  getResources: (params = {}) => apiClient.get('/public/resources', { params }),
  getResourceById: (resourceId) => apiClient.get(`/public/resources/${resourceId}`),
  getResourceCategories: () => apiClient.get('/public/resources/categories'),
  getResourcesByCategory: (category) => apiClient.get(`/public/resources/category/${category}`),
  downloadResource: (resourceId) => apiClient.get(`/public/resources/${resourceId}/download`),
};

// Team & Careers API
export const teamAPI = {
  getTeamMembers: () => apiClient.get('/public/team'),
  getTeamMemberById: (memberId) => apiClient.get(`/public/team/${memberId}`),
  getTeamDepartments: () => apiClient.get('/public/team/departments'),
  getCareers: (params = {}) => apiClient.get('/public/careers', { params }),
  getCareerById: (careerId) => apiClient.get(`/public/careers/${careerId}`),
  submitJobApplication: (careerId, applicationData) => apiClient.post(`/public/careers/${careerId}/apply`, applicationData),
};

// Partners & Affiliates API
export const partnerAPI = {
  getPartners: () => apiClient.get('/public/partners'),
  getPartnerById: (partnerId) => apiClient.get(`/public/partners/${partnerId}`),
  getPartnerCategories: () => apiClient.get('/public/partners/categories'),
  submitPartnershipInquiry: (inquiryData) => apiClient.post('/public/partners/inquiry', inquiryData),
  getAffiliateProgram: () => apiClient.get('/public/partners/affiliate-program'),
};

// Legal & Terms API
export const legalAPI = {
  getTermsOfService: () => apiClient.get('/public/legal/terms'),
  getPrivacyPolicy: () => apiClient.get('/public/legal/privacy'),
  getCookiePolicy: () => apiClient.get('/public/legal/cookies'),
  getAcceptableUsePolicy: () => apiClient.get('/public/legal/acceptable-use'),
  getRefundPolicy: () => apiClient.get('/public/legal/refund'),
  getServiceAgreement: () => apiClient.get('/public/legal/service-agreement'),
};

// System Status API
export const systemAPI = {
  getSystemStatus: () => apiClient.get('/public/system/status'),
  getSystemHealth: () => apiClient.get('/public/system/health'),
  getServiceStatus: () => apiClient.get('/public/system/service-status'),
  getMaintenanceSchedule: () => apiClient.get('/public/system/maintenance'),
  getSystemAnnouncements: () => apiClient.get('/public/system/announcements'),
};

// Analytics & Tracking API
export const analyticsAPI = {
  trackPageView: (pageData) => apiClient.post('/public/analytics/pageview', pageData),
  trackEvent: (eventData) => apiClient.post('/public/analytics/event', eventData),
  trackConversion: (conversionData) => apiClient.post('/public/analytics/conversion', conversionData),
  getAnalyticsSummary: () => apiClient.get('/public/analytics/summary'),
};

// Newsletter & Subscription API
export const newsletterAPI = {
  subscribeToNewsletter: (subscriptionData) => apiClient.post('/public/newsletter/subscribe', subscriptionData),
  unsubscribeFromNewsletter: (email) => apiClient.post('/public/newsletter/unsubscribe', { email }),
  updateNewsletterPreferences: (preferences) => apiClient.put('/public/newsletter/preferences', preferences),
  getNewsletterCategories: () => apiClient.get('/public/newsletter/categories'),
};

// Social Media API
export const socialAPI = {
  getSocialMediaLinks: () => apiClient.get('/public/social/links'),
  getSocialMediaFeeds: (platform) => apiClient.get(`/public/social/feeds/${platform}`),
  shareContent: (shareData) => apiClient.post('/public/social/share', shareData),
  getSocialMediaStats: () => apiClient.get('/public/social/stats'),
};

// Utility functions
export const utils = {
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  formatPhoneNumber: (phoneNumber) => {
    // Format phone number for display
    if (phoneNumber.startsWith('0')) {
      return phoneNumber;
    }
    if (phoneNumber.startsWith('+255')) {
      return '0' + phoneNumber.substring(4);
    }
    return phoneNumber;
  },
  formatCurrency: (amount, currency = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },
  formatRelativeDate: (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = Math.abs(now - targetDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return targetDate.toLocaleDateString('en-TZ');
    }
  },
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  validatePhoneNumber: (phoneNumber) => {
    const phoneRegex = /^(\+255|0)[0-9]{8,9}$/;
    return phoneRegex.test(phoneNumber);
  },
  sanitizeInput: (input) => {
    return input.replace(/[<>]/g, '');
  },
  truncateText: (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  generateSlug: (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};

export default apiClient; 