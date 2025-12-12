
import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

interface AuthModuleProps {
  onLoginSuccess?: (userData?: any) => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({ onLoginSuccess }) => {
  const [showReset, setShowReset] = useState(false);

  // Build the props object as `any` and spread it into LoginPage so TypeScript
  // does not require onLoginSuccess to be declared on LoginPageProps.
  const loginProps: any = { onForgotPassword: () => setShowReset(true) };
  if (onLoginSuccess) loginProps.onLoginSuccess = onLoginSuccess;

  return (
    <>
      {showReset ? (
        <ResetPasswordPage onBackToLogin={() => setShowReset(false)} />
      ) : (
        <LoginPage {...loginProps} />
      )}
    </>
  );
};

export default AuthModule;