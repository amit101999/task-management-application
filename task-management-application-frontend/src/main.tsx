import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store, persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  withCredentials: true,
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_LOGIN_OAUTH_ID}>
        <App />
      </GoogleOAuthProvider>
      <ToastContainer />
    </PersistGate>
  </Provider>
);
