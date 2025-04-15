import api from '@/config/axios';
import { ForgotForm, LoginForm, LoginResponseSchema, RegisterForm, ResetPasswordForm, Token } from '@/schemas/auth';
import { isAxiosError } from 'axios';

export const register = async (formData: RegisterForm) => {
  await api.post('/auth/register', formData);
};

export const google = async (code: string) => {
  return await api.post('/auth/google', { code });
};

export const verifyEmail = async (formData: Token) => {
  await api.post('/auth/verify-email', formData);
};

export const login = async (formData: LoginForm) => {
  try {
    return LoginResponseSchema.parse((await api.post('/auth/login', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const forgotPassword = async (formData: ForgotForm) => {
  await api.post('/auth/forgot-password', formData);
};

export const resetPassword = async (formData: ResetPasswordForm) => {
  await api.post('/auth/reset-password', formData);
};
