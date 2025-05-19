
export const validateEmail = (email: string): { isValid: boolean; errorMessage: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { isValid: false, errorMessage: 'Email is required' };
  } else if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address' };
  }
  
  return { isValid: true, errorMessage: '' };
};

export const validatePassword = (password: string, mode: 'login' | 'signup' | 'forgot-password' | 'admin-reset'): { isValid: boolean; errorMessage: string } => {
  if (mode === 'forgot-password' || mode === 'admin-reset') {
    return { isValid: true, errorMessage: '' };
  }
  
  if (!password) {
    return { isValid: false, errorMessage: 'Password is required' };
  } else if (mode === 'signup' && password.length < 6) {
    return { isValid: false, errorMessage: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true, errorMessage: '' };
};

export const validateUsername = (username: string, mode: 'login' | 'signup' | 'forgot-password' | 'admin-reset'): { isValid: boolean; errorMessage: string } => {
  if (mode !== 'signup') {
    return { isValid: true, errorMessage: '' };
  }
  
  const trimmedUsername = username.trim();
  
  if (!trimmedUsername) {
    return { isValid: false, errorMessage: 'Username is required' };
  } else if (trimmedUsername.length < 3) {
    return { isValid: false, errorMessage: 'Username must be at least 3 characters long' };
  }
  
  return { isValid: true, errorMessage: '' };
};
