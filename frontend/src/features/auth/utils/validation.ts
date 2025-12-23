export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 5;
};

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 5 characters';
  }

  return errors;
};

export const validateResetForm = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};
