import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

interface AuthModuleProps {
  onLoginSuccess?: (userData?: any) => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({ onLoginSuccess }) => {
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      {showReset ? (
        <ResetPasswordPage onBackToLogin={() => setShowReset(false)} />
      ) : (
        <LoginPage
          onForgotPassword={() => setShowReset(true)}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </>
  );
};

export default AuthModule;
