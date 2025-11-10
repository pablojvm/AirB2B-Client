// src/components/NavBar.jsx
import { useState, useContext } from "react";
import {
  Navbar,
  Container,
  Image,
  InputGroup,
  Button,
  Form,
  Dropdown,
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
  const [query, setQuery] = useState("");

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

  const goSearch = (city) => {
    const cityTrimmed = (city || query || "").trim();
    if (!cityTrimmed) return;
    navigate(`/search?city=${encodeURIComponent(cityTrimmed)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
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
        <InputGroup className="mb-0" style={{ maxWidth: 520 }}>
          <Form.Control
            placeholder="Introduce destino"
            style={{ borderRadius: "20px" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Buscar ciudad"
          />
          <Button
            variant="outline-secondary"
            style={{ borderRadius: "20px" }}
            onClick={() => goSearch()}
            aria-label="Buscar"
            title="Buscar"
          >
            <img src="lupa.png" width="15px" alt="Buscar" />
          </Button>
          {query && (
            <Button
              variant="link"
              onClick={() => setQuery("")}
              style={{ marginLeft: 8 }}
              title="Limpiar"
            >
              ✕
            </Button>
          )}
        </InputGroup>
      </Container>

      <Container style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="light" onClick={() => setShowHostModal(true)}>
          Hazte anfitrión
        </Button>

        <Dropdown as={ButtonGroup} show={showMenu} onToggle={setShowMenu}>
          <Button
            variant="light"
            onClick={toggleDropdown}
            style={{
              borderColor: "black",
              borderRadius: "20px",
              padding: 6,
            }}
            aria-haspopup="menu"
            aria-expanded={showMenu}
          >
            <img src="/burguer.png" width="20px" alt="Menú" />
          </Button>

          {isLoggedIn ? (
            <Dropdown.Menu align="end" show={showMenu} onClick={closeDropdown}>
              <Dropdown.Item as={Link} to="/myHouses">
                Mis Alojamientos
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/favoriteshousing">
                Favoritos
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/myBookings">
                Reservas
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/myProfile">Perfil</Dropdown.Item>
              <Dropdown.Item as={Link} to="/myReviews">Mis reseñas</Dropdown.Item>
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
      <ModalHost show={showHostModal} handleClose={() => setShowHostModal(false)} />
    </Navbar>
  );
}

export default NavBar;
