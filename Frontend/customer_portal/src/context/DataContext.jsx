import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';


// Import mock APIs for testing (comment out when using real backend)
import {
  mockGetActivePackages,
  mockGetCoverageAreas,
  mockGetPublicHealth,
  mockGetPublicPackages
} from '../services/mockApi';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState([]);

  // Preload all necessary data
  const {
    data: packages,
    isLoading: isLoadingPackages,
    error: packagesError,
    refetch: refetchPackages
  } = useQuery('activePackages', mockGetActivePackages, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: 1000,
    onSuccess: () => {
      setLoadingProgress(prev => prev + 25);
      setLoadingMessages(prev => [...prev, '✓ Internet packages loaded']);
    },
    onError: () => {
      setLoadingMessages(prev => [...prev, '⚠ Failed to load packages']);
    }
  });

  const {
    data: coverageAreas,
    isLoading: isLoadingCoverage,
    error: coverageError,
    refetch: refetchCoverage
  } = useQuery('coverageAreas', mockGetCoverageAreas, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: 1000,
    onSuccess: () => {
      setLoadingProgress(prev => prev + 25);
      setLoadingMessages(prev => [...prev, '✓ Coverage areas loaded']);
    },
    onError: () => {
      setLoadingMessages(prev => [...prev, '⚠ Failed to load coverage areas']);
    }
  });

  const {
    data: publicPackages,
    isLoading: isLoadingPublicPackages,
    error: publicPackagesError,
    refetch: refetchPublicPackages
  } = useQuery('publicPackages', mockGetPublicPackages, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: 1000,
    onSuccess: () => {
      setLoadingProgress(prev => prev + 25);
      setLoadingMessages(prev => [...prev, '✓ Public packages loaded']);
    },
    onError: () => {
      setLoadingMessages(prev => [...prev, '⚠ Failed to load public packages']);
    }
  });

  const {
    data: healthStatus,
    isLoading: isLoadingHealth,
    error: healthError,
    refetch: refetchHealth
  } = useQuery('publicHealth', mockGetPublicHealth, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: 1000,
    onSuccess: () => {
      setLoadingProgress(prev => prev + 25);
      setLoadingMessages(prev => [...prev, '✓ System health checked']);
    },
    onError: () => {
      setLoadingMessages(prev => [...prev, '⚠ Health check failed']);
    }
  });

  // Monitor overall loading state
  useEffect(() => {
    const allQueriesLoaded = !isLoadingPackages && !isLoadingCoverage && 
                            !isLoadingPublicPackages && !isLoadingHealth;
    
    if (allQueriesLoaded) {
      // Add a small delay to show completion message
      setTimeout(() => {
        setLoadingMessages(prev => [...prev, '✓ All data loaded successfully']);
        setIsDataLoaded(true);
      }, 500);
    }
  }, [isLoadingPackages, isLoadingCoverage, isLoadingPublicPackages, isLoadingHealth]);

  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsDataLoaded(false);
      setLoadingProgress(0);
      setLoadingMessages([]);
    };
  }, []);

  const value = {
    // Data
    packages,
    coverageAreas,
    publicPackages,
    healthStatus,
    
    // Loading states
    isDataLoaded,
    isLoadingPackages,
    isLoadingCoverage,
    isLoadingPublicPackages,
    isLoadingHealth,
    loadingProgress,
    loadingMessages,
    
    // Errors
    packagesError,
    coverageError,
    publicPackagesError,
    healthError,
    
    // Refetch functions
    refetchPackages,
    refetchCoverage,
    refetchPublicPackages,
    refetchHealth,
    
    // Overall loading state
    isLoading: isLoadingPackages || isLoadingCoverage || isLoadingPublicPackages || isLoadingHealth,
    hasErrors: packagesError || coverageError || publicPackagesError || healthError,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 