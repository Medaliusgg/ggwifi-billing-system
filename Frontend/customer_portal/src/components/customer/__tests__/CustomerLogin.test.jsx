import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CustomerLogin from '../CustomerLogin';
import { customerAuthAPI } from '../../../services/api';

// Mock the API
vi.mock('../../../services/api', () => ({
  customerAuthAPI: {
    requestOtp: vi.fn(),
    verifyOtp: vi.fn(),
  },
}));

// Mock device fingerprint
vi.mock('../../../utils/deviceFingerprint', () => ({
  getDeviceFingerprint: vi.fn(() => Promise.resolve('test-fingerprint-123')),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CustomerLogin', () => {
  const mockOnSuccess = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render phone input step', () => {
    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/Access your customer portal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Request OTP/i)).toBeInTheDocument();
  });

  it('should request OTP when phone number is entered', async () => {
    customerAuthAPI.requestOtp.mockResolvedValue({
      status: 'success',
      message: 'OTP sent successfully',
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // Wait for fingerprint to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const requestButton = screen.getByText(/Request OTP/i);

    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(requestButton);

    // Wait for API call and step change
    await waitFor(() => {
      expect(customerAuthAPI.requestOtp).toHaveBeenCalledWith({
        phoneNumber: '+255742844024',
        deviceFingerprint: 'test-fingerprint-123',
      });
    }, { timeout: 3000 });
  });

  it('should show OTP input after successful OTP request', async () => {
    customerAuthAPI.requestOtp.mockResolvedValue({
      status: 'success',
      message: 'OTP sent successfully',
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const requestButton = screen.getByText(/Request OTP/i);

    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByText(/Enter the code sent to/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/6-digit OTP/i)).toBeInTheDocument();
    });
  });

  it('should verify OTP and call onSuccess', async () => {
    customerAuthAPI.requestOtp.mockResolvedValue({
      status: 'success',
      message: 'OTP sent successfully',
    });

    customerAuthAPI.verifyOtp.mockResolvedValue({
      data: {
        status: 'success',
        message: 'Login successful',
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        account: {
          id: 1,
          phoneNumber: '+255742844024',
          fullName: 'Test User',
        },
      },
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // Request OTP
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(screen.getByText(/Request OTP/i));

    // Wait for OTP input
    await waitFor(() => {
      expect(screen.getByLabelText(/6-digit OTP/i)).toBeInTheDocument();
    });

    // Enter OTP and verify
    const otpInput = screen.getByLabelText(/6-digit OTP/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByText(/Verify & Continue/i));

    await waitFor(() => {
      expect(customerAuthAPI.verifyOtp).toHaveBeenCalledWith({
        phoneNumber: '+255742844024',
        otpCode: '123456',
        deviceFingerprint: 'test-fingerprint-123',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith({
        phoneNumber: '+255742844024',
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        account: {
          id: 1,
          phoneNumber: '+255742844024',
          fullName: 'Test User',
        },
      });
    });
  });

  it('should show error on OTP request failure', async () => {
    customerAuthAPI.requestOtp.mockRejectedValue({
      response: {
        data: {
          message: 'Too many OTP requests',
        },
      },
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(screen.getByText(/Request OTP/i));

    await waitFor(() => {
      expect(screen.getByText(/Too many OTP requests/i)).toBeInTheDocument();
    });
  });

  it('should show error on invalid OTP', async () => {
    customerAuthAPI.requestOtp.mockResolvedValue({
      status: 'success',
      message: 'OTP sent successfully',
    });

    customerAuthAPI.verifyOtp.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid or expired OTP',
        },
      },
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // Request OTP
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(screen.getByText(/Request OTP/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/6-digit OTP/i)).toBeInTheDocument();
    });

    // Enter invalid OTP
    const otpInput = screen.getByLabelText(/6-digit OTP/i);
    fireEvent.change(otpInput, { target: { value: '000000' } });
    fireEvent.click(screen.getByText(/Verify & Continue/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired OTP/i)).toBeInTheDocument();
    });
  });

  it('should allow resending OTP after countdown', async () => {
    customerAuthAPI.requestOtp.mockResolvedValue({
      status: 'success',
      message: 'OTP sent successfully',
    });

    render(<CustomerLogin onSuccess={mockOnSuccess} onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // Request OTP
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '+255742844024' } });
    fireEvent.click(screen.getByText(/Request OTP/i));

    await waitFor(() => {
      expect(screen.getByText(/Resend OTP in/i)).toBeInTheDocument();
    });

    // Resend button should be disabled during countdown
    const resendButton = screen.getByText(/Resend OTP in/i);
    expect(resendButton.closest('button')).toBeDisabled();
  });
});

