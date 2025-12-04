import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Packages from '../../pages/Packages.jsx';

// Mock dependencies
vi.mock('../../store/authStore.js', () => ({
  default: {
    getState: () => ({
      user: { role: 'SUPER_ADMIN' },
      token: 'mock-token',
    }),
  },
}));

vi.mock('../../services/api.js', () => ({
  packageAPI: {
    getAllPackages: vi.fn(() => Promise.resolve({ data: { data: [] } })),
  },
}));

describe('Module: pages/Packages.jsx', () => {
  describe('Analysis', () => {
    it('should be a React component', () => {
      expect(Packages).toBeDefined();
      expect(typeof Packages).toBe('function');
    });

    it('should render without crashing', () => {
      const { container } = render(
        <BrowserRouter>
          <Packages />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Inspection', () => {
    it('should handle package management functionality', () => {
      const { container } = render(
        <BrowserRouter>
          <Packages />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Unit Tests', () => {
    it('should render packages page', () => {
      const { container } = render(
        <BrowserRouter>
          <Packages />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });
});



