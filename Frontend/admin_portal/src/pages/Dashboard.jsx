import React from 'react';
import useAuthStore from '../store/authStore';
import SimpleAdminDashboard from '../components/dashboard/SimpleAdminDashboard';
import TechnicianDashboard from '../components/dashboard/TechnicianDashboard';
import FinanceDashboard from '../components/dashboard/FinanceDashboard';
import CampaignDashboard from '../components/dashboard/MarketingDashboard';
import TestDashboard from '../components/dashboard/TestDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();

  console.log('🔍 Dashboard component rendered:', { user });

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return <SimpleAdminDashboard />;
      case 'TECHNICIAN':
        return <TechnicianDashboard />;
      case 'FINANCE':
        return <FinanceDashboard />;
      case 'MARKETING':
      case 'SALES':
        return <CampaignDashboard />;
      default:
        return <SimpleAdminDashboard />; // Default to admin dashboard
    }
  };

  return renderDashboard();
};

export default Dashboard;