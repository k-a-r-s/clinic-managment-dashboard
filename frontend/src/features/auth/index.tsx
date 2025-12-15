import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

export const AuthModule: React.FC = () => {
  const [showReset, setShowReset] = useState(false);
  // AuthModule no longer performs the context login here; LoginPage handles persisting the user

  return (
    <>
      {showReset ? (
        <ResetPasswordPage onBackToLogin={() => setShowReset(false)} />
      ) : (
        <LoginPage
          onForgotPassword={() => setShowReset(true)}
          onLoginSuccess={() => { /* noop - LoginPage writes to AuthContext directly */ }}
        />
      )}
    </>
  );
};

export default AuthModule;
