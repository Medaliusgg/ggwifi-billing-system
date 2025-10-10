// Admin Data Seeder for GGNetworks Admin Portal
// This utility creates the initial admin user with the specified credentials

export const ADMIN_CREDENTIALS = {
  username: 'medaliusgg',
  phoneNumber: '0676591880',
  password: '#Kolombo@123%',
  firstName: 'Medalius',
  lastName: 'GG',
  role: 'ADMIN',
  status: 'ACTIVE',
  permissions: [
    'dashboard:read',
    'users:read',
    'users:write',
    'routers:read',
    'routers:write',
    'vouchers:read',
    'vouchers:write',
    'packages:read',
    'packages:write',
    'payments:read',
    'payments:write',
    'analytics:read',
    'settings:read',
    'settings:write',
    'system:admin'
  ]
};

export const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = localStorage.getItem('ggnetworks_admin');
    
    if (!existingAdmin) {
      // Create admin user data
      const adminUser = {
        id: 1,
        ...ADMIN_CREDENTIALS,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        profile: {
          avatar: null,
          bio: 'System Administrator for GGNetworks',
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: true,
            autoRefresh: true
          }
        }
      };

      // Store in localStorage
      localStorage.setItem('ggnetworks_admin', JSON.stringify(adminUser));
      
      console.log('✅ Admin user seeded successfully');
      return { success: true, message: 'Admin user created successfully' };
    } else {
      console.log('ℹ️ Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    return { success: false, message: 'Failed to seed admin user' };
  }
};

export const getAdminCredentials = () => {
  return ADMIN_CREDENTIALS;
};

export const validateAdminCredentials = (username, password) => {
  return username === ADMIN_CREDENTIALS.username && 
         password === ADMIN_CREDENTIALS.password;
};

export const getAdminUser = () => {
  try {
    const adminData = localStorage.getItem('ggnetworks_admin');
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
};

export const updateAdminLastLogin = () => {
  try {
    const adminData = localStorage.getItem('ggnetworks_admin');
    if (adminData) {
      const admin = JSON.parse(adminData);
      admin.lastLogin = new Date().toISOString();
      localStorage.setItem('ggnetworks_admin', JSON.stringify(admin));
    }
  } catch (error) {
    console.error('Error updating admin last login:', error);
  }
};

// Initialize admin user when the app starts
export const initializeAdmin = () => {
  seedAdminUser();
};

const adminSeeder = {
  ADMIN_CREDENTIALS,
  seedAdminUser,
  getAdminCredentials,
  validateAdminCredentials,
  getAdminUser,
  updateAdminLastLogin,
  initializeAdmin
};

export default adminSeeder; 