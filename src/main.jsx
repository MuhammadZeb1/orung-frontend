import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* <GoogleOAuthProvider clientId={googleClientId}> */}
        <GoogleOAuthProvider clientId="118018508470-f1lugathu53bj7t5n1vqvmqlp7h0ji4n.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
