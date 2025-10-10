// Mock API service for testing data preloading
// This simulates the backend responses

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockPackages = [
  {
    id: 1,
    name: "Short Plan",
    speed: 25,
    validity: "12 hours",
    price: 1000,
    isPopular: false,
    features: ["High-speed internet", "Quick access", "Perfect for short-term use"]
  },
  {
    id: 2,
    name: "Daily Plan",
    speed: 25,
    validity: "24 hours",
    price: 2000,
    isPopular: true,
    features: ["High-speed internet", "24-hour access", "Ideal for daily usage"]
  },
  {
    id: 3,
    name: "Weekly Plan",
    speed: 25,
    validity: "7 days",
    price: 6000,
    isPopular: false,
    features: ["High-speed internet", "7-day access", "Great value for weekly usage"]
  },
  {
    id: 4,
    name: "Monthly Plan",
    speed: 25,
    validity: "30 days",
    price: 20000,
    isPopular: true,
    features: ["High-speed internet", "30-day access", "Best value for long-term use"]
  }
];

const mockCoverageAreas = [
  {
    id: 1,
    name: "Dar es Salaam",
    type: "City",
    icon: "BusinessIcon",
    areas: [
      {
        name: "City Centre",
        address: "Dar es Salaam City Centre",
        status: "Available",
        speed: "Up to 100 Mbps",
        coverage: "Excellent",
        phone: "+255744123456",
        whatsapp: "+255744123456",
        email: "info@ggnetworks.co.tz"
      },
      {
        name: "Masaki",
        address: "Masaki, Dar es Salaam",
        status: "Available",
        speed: "Up to 50 Mbps",
        coverage: "Good",
        phone: "+255744123457",
        whatsapp: "+255744123457",
        email: "info@ggnetworks.co.tz"
      },
      {
        name: "Oyster Bay",
        address: "Oyster Bay, Dar es Salaam",
        status: "Available",
        speed: "Up to 25 Mbps",
        coverage: "Good",
        phone: "+255744123458",
        whatsapp: "+255744123458",
        email: "info@ggnetworks.co.tz"
      }
    ]
  },
  {
    id: 2,
    name: "Arusha",
    type: "City",
    icon: "HomeIcon",
    areas: [
      {
        name: "Arusha City",
        address: "Arusha City Centre",
        status: "Available",
        speed: "Up to 50 Mbps",
        coverage: "Good",
        phone: "+255744123459",
        whatsapp: "+255744123459",
        email: "info@ggnetworks.co.tz"
      }
    ]
  }
];

const mockHealthStatus = {
  status: "healthy",
  timestamp: new Date().toISOString(),
  version: "1.0.0",
  uptime: "99.9%"
};

// Mock API functions
export const mockGetActivePackages = async () => {
  await delay(800); // Simulate network delay
  return mockPackages;
};

export const mockGetCoverageAreas = async () => {
  await delay(600); // Simulate network delay
  return mockCoverageAreas;
};

export const mockGetPublicHealth = async () => {
  await delay(300); // Simulate network delay
  return mockHealthStatus;
};

export const mockGetPublicPackages = async () => {
  await delay(500); // Simulate network delay
  return mockPackages;
};

export const mockValidateVoucher = async (voucherCode) => {
  await delay(400);
  
  // Validate that it's a 6-character hexadecimal code
  if (!/^[0-9A-F]{6}$/.test(voucherCode)) {
    return {
      isValid: false,
      message: 'Invalid voucher code format. Must be 6 hexadecimal characters (0-9, A-F)'
    };
  }
  
  // Simulate voucher validation - accept any valid 6-character hex code
  const isValidVoucher = voucherCode.length === 6 && /^[0-9A-F]{6}$/.test(voucherCode);
  
  if (isValidVoucher) {
    // Randomly assign to different package types for testing
    const packageTypes = [
      {
        name: 'Short Plan',
        speed: '25 Mbps',
        validity: '12 hours'
      },
      {
        name: 'Daily Plan',
        speed: '25 Mbps',
        validity: '24 hours'
      },
      {
        name: 'Weekly Plan',
        speed: '25 Mbps',
        validity: '7 days'
      },
      {
        name: 'Monthly Plan',
        speed: '25 Mbps',
        validity: '30 days'
      }
    ];
    
    const randomPackage = packageTypes[Math.floor(Math.random() * packageTypes.length)];
    
    return {
      isValid: true,
      message: 'Voucher is valid',
      voucherDetails: {
        code: voucherCode,
        status: 'active',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      packageDetails: randomPackage,
      boundPhoneNumber: null
    };
  } else {
    return {
      isValid: false,
      message: 'Invalid voucher code'
    };
  }
};

export const mockConnectWithVoucher = async (data) => {
  await delay(600);
  
  return {
    success: true,
    sessionId: `session_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    message: 'Successfully connected to the internet'
  };
};

export const mockPurchasePackage = async (data) => {
  await delay(1000);
  
  return {
    success: true,
    voucherCode: `VOUCHER${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    message: 'Package purchased successfully'
  };
}; 