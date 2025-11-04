import { useState, useContext } from "react";
import {
  Navbar,
  Container,
  Image,
  InputGroup,
  Button,
  Form,
  Dropdown,
  NavDropdown,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import ModalLogin from "./ModalLogin";
import ModalLoginDone from "./ModalLoginDone";
import ModalHost from "./ModalHost";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleDropdown = () => setShowMenu(!showMenu);
  const closeDropdown = () => setShowMenu(false);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    try {
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" id="navbar">
      <Container id="logo">
        <Link to="/">
          <Image src="logoair.png" width="100px" />
        </Link>
      </Container>

      <Container>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Introducir destino"
            style={{ borderRadius: "20px" }}
          />
          <Button variant="outline-secondary" style={{ borderRadius: "20px" }}>
            <img src="lupa.png" width="15px" />
          </Button>
        </InputGroup>
      </Container>

      <Container style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="light" onClick={() => setShowHostModal(true)}>
          Hazte anfitrion
        </Button>
        <Dropdown as={ButtonGroup} show={showMenu} onToggle={setShowMenu}>
      <Button variant="light" onClick={toggleDropdown} style={{
    borderColor: "black",
    borderRadius: "20px",
    padding: 6,
    onClick: ""
  }}>
        <img src="/config.png" width="20px" alt="configuración" />
      </Button>

      {isLoggedIn ? (
        <Dropdown.Menu align="end" show={showMenu} onClick={closeDropdown}>
          <Dropdown.Item as={Link} to="/myHouses">
            Mis Alojamientos
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/favoriteshousing">
            Mis Favoritos
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/myProfile">
            Perfil
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
        </Dropdown.Menu>
      ) : (
        <Dropdown.Menu align="end" show={showMenu} onClick={closeDropdown}>
          <Dropdown.Item onClick={() => setShowLoginModal(true)}>
            Entrar o Registrarme
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
    </Dropdown>
      </Container>
      <ModalLogin
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        onSignupSuccess={() => {
          setShowLoginModal(false);
          setShowSuccessModal(true);
        }}
      />
      <ModalLoginDone
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />

      <ModalHost
        show={showHostModal}
        handleClose={() => setShowHostModal(false)}
      />
    </Navbar>
  );
}

export default NavBar;
