import { useState, useContext } from 'react';
import { Card, Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import service from '../services/service.config';

function ModalLogin({ show, handleClose }) {
    const navigate = useNavigate();

  const { authenticateUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonSignup, setButtonSignup] = useState("login");
  // NOTE: show and handleClose are now controlled by parent props

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userCredentials = {
      username,
      password,
    };

    try {
      const response = await service.post(`/auth/login`, userCredentials)
      localStorage.setItem("authToken", response.data.authToken);
      await authenticateUser();
      navigate("/own-ads");
      // optionally close modal after login:
      handleClose && handleClose();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Algo salió mal. Inténtalo de nuevo.");
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        email,
        username,
        password,
      };
      const response = await service.post(`/auth/signup`, newUser);
      // switch view to login after signup (internal toggle)
      toggleSignup();
      // cerrar modal — el padre controla el estado, usamos handleClose prop
      handleClose && handleClose();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("Algo salió mal. Inténtalo de nuevo.");
      }
    }
  };

  const toggleSignup = () => {
    setButtonSignup((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        {buttonSignup === "login" && (
        <Card style={{ width: "18rem" }}>
          <Card.Title>Inicia Sesión</Card.Title>
          <Card.Body>
            <Form onSubmit={handleLogin}>
              <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </FloatingLabel>

              <Button variant="danger" className="w-100 mb-3" type="submit">
                Accede!
              </Button>
            </Form>
            <Button
              variant="secondary"
              className="w-100"
              onClick={toggleSignup}
            >
              Aun no tienes cuenta?
            </Button>
          </Card.Body>
        </Card>
      )}
      {buttonSignup === "signup" && (
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Regístrate</Card.Title>
            <Form onSubmit={handleSignup}>
              <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPassword"
                label="Email"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </FloatingLabel>
              <Button variant="danger" className="w-100 mb-3" type="submit">
                Crear
              </Button>
            </Form>
            <Button
              variant="secondary"
              className="w-100"
              onClick={toggleSignup}
            >
              ¿Ya tienes cuenta?
            </Button>
          </Card.Body>
        </Card>
      )}
      </Modal>
    </>
  );
}

export default ModalLogin;
