import { useState, useContext } from "react";
import { Modal, Form, FloatingLabel, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/auth.context";
import service from "../services/service.config";
import ModalLoginDone from "./ModalLoginDone";

function ModalLogin({ show, handleClose }) {
  const { authenticateUser } = useContext(AuthContext);

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setErrorMessage(null);
  };

  const handleCloseAndReset = () => {
    if (loading) return;
    resetForm();
    handleClose();
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setErrorMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await service.post("/auth/login", { username, password });
      localStorage.setItem("authToken", res.data.authToken);
      await authenticateUser();
      resetForm();
      handleClose();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.errorMessage || "No se pudo iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      await service.post("/auth/signup", { username, email, password });
      const loginRes = await service.post("/auth/login", { username, password });
      localStorage.setItem("authToken", loginRes.data.authToken);
      await authenticateUser();
      resetForm();
      handleClose();
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.errorMessage || "No se pudo crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleCloseAndReset}
        centered
        contentClassName="airb2b-modal"
      >
        <div className="airb2b-modal__header">
          <button
            type="button"
            className="airb2b-modal__close"
            onClick={handleCloseAndReset}
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className="airb2b-modal__title">
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </div>
        </div>

        <Modal.Body className="airb2b-modal__body">
          <h4 className="airb2b-modal__welcome">
            {mode === "login"
              ? "Bienvenido de vuelta a AirB2B"
              : "Encuentra tu próximo destino"}
          </h4>

          <Form onSubmit={mode === "login" ? handleLogin : handleSignup}>
            <FloatingLabel
              controlId="modalUsername"
              label="Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </FloatingLabel>

            {mode === "signup" && (
              <FloatingLabel controlId="modalEmail" label="Email" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FloatingLabel>
            )}

            <FloatingLabel
              controlId="modalPassword"
              label="Contraseña"
              className="mb-3"
            >
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </FloatingLabel>

            {errorMessage && (
              <p className="text-danger text-center small mb-2">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="airb2b-btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : mode === "login" ? (
                "Iniciar sesión"
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </Form>

          <div className="airb2b-modal__divider">
            <span>o</span>
          </div>

          <Button
            variant="outline-dark"
            className="airb2b-btn-outline w-100"
            onClick={toggleMode}
            disabled={loading}
          >
            {mode === "login" ? "Crear cuenta nueva" : "Ya tengo cuenta"}
          </Button>
        </Modal.Body>
      </Modal>

      <ModalLoginDone
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}

export default ModalLogin;
