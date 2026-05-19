import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./context/auth.context.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </BrowserRouter>
);
