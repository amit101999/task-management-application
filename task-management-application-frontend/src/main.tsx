import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store, persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { io } from "socket.io-client";
import { ErrorBoundary } from "./components/ErrorBoundary";

const baseUrl = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
export const socket = io(baseUrl, {
  withCredentials: true,
});

const oauthClientId = import.meta.env.VITE_LOGIN_OAUTH_ID ?? "";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={<div className="flex items-center justify-center min-h-screen">Loading...</div>} persistor={persistor}>
      <GoogleOAuthProvider clientId={oauthClientId}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </GoogleOAuthProvider>
      <ToastContainer />
    </PersistGate>
  </Provider>
);
