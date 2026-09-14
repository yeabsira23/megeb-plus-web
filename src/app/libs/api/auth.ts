import apiClient from './client';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  role: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface User {
  id?: number | string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Get current authenticated user
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>(
    '/api/auth/me/'
  );

  return response.data;
}

/**
 * Login with email or phone number
 */
export async function login(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/auth/login/',
    {
      identifier,
      password,
    }
  );

  return response.data;
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: Record<string, unknown>
): Promise<User> {
  const response = await apiClient.patch<User>(
    '/api/auth/profile/',
    data
  );

  return response.data;
}

/**
 * Change password for an authenticated user
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const response = await apiClient.post(
    '/api/auth/change-password/',
    {
      current_password: currentPassword,
      new_password: newPassword,
    }
  );

  return response.data;
}

/**
 * Send OTP to phone
 *
 * Used for phone verification.
 */
export async function sendOtp(identifier: string) {
  const response = await apiClient.post(
    '/api/auth/send-otp/',
    {
      identifier,
    }
  );

  return response.data;
}

/**
 * Verify phone OTP
 */
export async function verifyOtp(
  identifier: string,
  otp: string
) {
  const response = await apiClient.post(
    '/api/auth/verify-otp/',
    {
      identifier,
      otp,
    }
  );

  return response.data;
}

/**
 * Send email OTP
 *
 * Used for:
 * - Registration
 * - Password reset
 *
 * IMPORTANT:
 * Password reset MUST use:
 * purpose: "password_reset"
 */
export async function sendEmailOtp(
  email: string,
  purpose: 'registration' | 'password_reset' = 'registration'
) {
  const response = await apiClient.post(
    '/api/auth/send-email-otp/',
    {
      email,
      purpose,
    }
  );

  return response.data;
}

/**
 * Verify email OTP
 *
 * Used for:
 * - Registration
 * - Password reset
 *
 * The purpose MUST match the purpose used
 * when the OTP was sent.
 */
export async function verifyEmailOtp(
  email: string,
  otp: string,
  purpose: 'registration' | 'password_reset' = 'registration'
) {
  const response = await apiClient.post(
    '/api/auth/verify-email-otp/',
    {
      email,
      otp,
      purpose,
    }
  );

  return response.data;
}

/**
 * Reset password
 *
 * IMPORTANT:
 * The backend does NOT require the OTP here.
 *
 * The OTP must have been successfully verified
 * using verifyEmailOtp() with:
 *
 * purpose: "password_reset"
 *
 * The backend then allows the password reset
 * for 15 minutes.
 */
export async function resetPassword(
  email: string,
  newPassword: string,
  confirmNewPassword: string
) {
  const response = await apiClient.post(
    '/api/auth/reset-password/',
    {
      email,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }
  );

  return response.data;
}