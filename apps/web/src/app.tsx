import { useState } from "react";
import { LoginPage } from "./features/auth/login-page";
import { OperationsPage } from "./features/operations/operations-page";

export function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem("hospedex_session")));

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return <OperationsPage />;
}
