import { useState, useContext } from "react";
import { Card, Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import service from "../services/service.config";
import ModalLoginDone from "./ModalLoginDone";

function ModalLogin({ show, handleClose }) {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonSignup, setButtonSignup] = useState("login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setErrorMessage(null);
  };

  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };

  const toggleSignup = () => {
    setButtonSignup((prev) => (prev === "login" ? "signup" : "login"));
    setErrorMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await service.post("/auth/login", { username, password });
      localStorage.setItem("authToken", res.data.authToken);
      await authenticateUser();
      resetForm();
      handleClose();
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data.errorMessage || "Algo salió mal");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Creamos usuario
      await service.post("/auth/signup", { username, email, password });

      // Login automático tras signup
      const loginRes = await service.post("/auth/login", { username, password });
      localStorage.setItem("authToken", loginRes.data.authToken);
      await authenticateUser();

      resetForm();
      handleClose();

      // Mostramos modal de éxito
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.response?.data.errorMessage || "Algo salió mal");
    }
  };

  return (
    <>
      {/* Modal principal */}
      <Modal show={show} onHide={handleCloseAndReset} centered>
        {buttonSignup === "login" ? (
          <Card className="p-3 shadow-sm border-0">
            <Card.Title className="text-center mb-4 fw-bold">Inicia Sesión</Card.Title>
            <Card.Body>
              <Form onSubmit={handleLogin}>
                <FloatingLabel controlId="loginUsername" label="Username" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel controlId="loginPassword" label="Password" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </FloatingLabel>

                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

                <Button variant="danger" className="w-100 mb-3" type="submit">Accede!</Button>
              </Form>
              <Button variant="secondary" className="w-100" onClick={toggleSignup}>
                ¿Aún no tienes cuenta?
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="p-3 shadow-sm border-0">
            <Card.Title className="text-center mb-4 fw-bold">Regístrate</Card.Title>
            <Card.Body>
              <Form onSubmit={handleSignup}>
                <FloatingLabel controlId="signupUsername" label="Username" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel controlId="signupEmail" label="Email" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel controlId="signupPassword" label="Password" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </FloatingLabel>

                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

                <Button variant="danger" className="w-100 mb-3" type="submit">Crear</Button>
              </Form>
              <Button variant="secondary" className="w-100" onClick={toggleSignup}>
                ¿Ya tienes cuenta?
              </Button>
            </Card.Body>
          </Card>
        )}
      </Modal>

      {/* Modal de éxito */}
      <ModalLoginDone
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}

export default ModalLogin;
