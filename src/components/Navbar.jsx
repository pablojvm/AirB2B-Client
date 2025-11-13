import { useState, useContext, useEffect } from "react";
import {
  Navbar,
  Container,
  Row,
  Col,
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
import service from "../services/service.config";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser, loggedUserId } =
    useContext(AuthContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [acc, setAcc] = useState("Hazte anfitrión");

  const toggleDropdown = () => setShowMenu(!showMenu);
  const closeDropdown = () => setShowMenu(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await service.get(`/accommodation/own`, loggedUserId);
      setAcc(response.data);
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
    }
  };

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
    <>
      <Navbar expand="lg" className="bg-body-tertiary py-2" id="navbar">
        <Container fluid className="px-3">
          <div className="d-none d-lg-flex align-items-center w-100">
            <Row className="w-100 align-items-center">
              <Col lg={3} className="d-flex align-items-center">
                <Link to="/" className="d-flex align-items-center">
                  <Image
                    src="logoair.png"
                    width={100}
                    height="auto"
                    alt="Logo"
                  />
                </Link>
              </Col>
              <Col lg={6} className="d-flex justify-content-center">
                <div style={{ width: "100%", maxWidth: 520 }}>
                  <InputGroup className="mb-0 w-100">
                    <Form.Control
                      placeholder="Introduce destino"
                      className="rounded-pill"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={onKeyDown}
                      aria-label="Buscar ciudad"
                    />
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill"
                      onClick={() => goSearch()}
                      aria-label="Buscar"
                      title="Buscar"
                      style={{ marginLeft: 8 }}
                    >
                      <img src="lupa.png" width="15" alt="Buscar" />
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
                </div>
              </Col>
              <Col
                lg={3}
                className="d-flex justify-content-end align-items-center"
              >
                {acc.length == 0 ? (
                  <Button
                    variant="light"
                    onClick={() => setShowHostModal(true)}
                    className="me-2"
                  >
                    Hazte anfitrión
                  </Button>
                ) : (
                  <Button
                    variant="light"
                    onClick={() => setShowHostModal(true)}
                    className="me-2"
                  >
                    Sube otro alojamiento
                  </Button>
                )}

                <Dropdown
                  as={ButtonGroup}
                  show={showMenu}
                  onToggle={setShowMenu}
                >
                  <Button
                    variant="light"
                    onClick={toggleDropdown}
                    style={{ borderRadius: "20px", padding: 6 }}
                    aria-haspopup="menu"
                    aria-expanded={showMenu}
                  >
                    <img src="/burguer.png" width="20" alt="Menú" />
                  </Button>

                  {isLoggedIn ? (
                    <Dropdown.Menu
                      align="end"
                      show={showMenu}
                      onClick={closeDropdown}
                    >
                      <Dropdown.Item as={Link} to="/myHouses">
                        Mis Alojamientos
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/favoriteshousing">
                        Favoritos
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myBookings">
                        Reservas
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myProfile">
                        Perfil
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myReviews">
                        Mis reseñas
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Cerrar Sesión
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu
                      align="end"
                      show={showMenu}
                      onClick={closeDropdown}
                    >
                      <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                        Entrar o Registrarme
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </Col>
            </Row>
          </div>
          <div className="d-flex d-lg-none flex-column w-100">
            <div className="d-flex w-100 justify-content-between align-items-center mb-2">
              <Link to="/" className="d-flex align-items-center">
                <Image src="logoair.png" width={90} height="auto" alt="Logo" />
              </Link>

              <div className="d-flex align-items-center">
                <Button
                  variant="light"
                  onClick={() => setShowHostModal(true)}
                  className="me-2"
                >
                  Hazte anfitrión
                </Button>

                <Dropdown
                  as={ButtonGroup}
                  show={showMenu}
                  onToggle={setShowMenu}
                >
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
                    <img src="/burguer.png" width="20" alt="Menú" />
                  </Button>

                  {isLoggedIn ? (
                    <Dropdown.Menu
                      align="end"
                      show={showMenu}
                      onClick={closeDropdown}
                    >
                      <Dropdown.Item as={Link} to="/myHouses">
                        Mis Alojamientos
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/favoriteshousing">
                        Favoritos
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myBookings">
                        Reservas
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myProfile">
                        Perfil
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myReviews">
                        Mis reseñas
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Cerrar Sesión
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu
                      align="end"
                      show={showMenu}
                      onClick={closeDropdown}
                    >
                      <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                        Entrar o Registrarme
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
            </div>
            <div className="w-100">
              <InputGroup className="mb-0 w-100">
                <Form.Control
                  placeholder="Introduce destino"
                  className="rounded-pill"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Buscar ciudad"
                />
                <Button
                  variant="outline-secondary"
                  className="rounded-pill"
                  onClick={() => goSearch()}
                  aria-label="Buscar"
                  title="Buscar"
                  style={{ marginLeft: 8 }}
                >
                  <img src="lupa.png" width="15" alt="Buscar" />
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
            </div>
          </div>
        </Container>
      </Navbar>
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
    </>
  );
}

export default NavBar;
