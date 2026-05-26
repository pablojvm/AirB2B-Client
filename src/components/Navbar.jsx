import { useState, useContext, useEffect, useRef } from "react";
import { Navbar, Container, Image, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import ModalLogin from "./ModalLogin";
import ModalLoginDone from "./ModalLoginDone";
import ModalHost from "./ModalHost";
import service from "../services/service.config";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [ownCount, setOwnCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOwn = async () => {
      if (!isLoggedIn) {
        setOwnCount(0);
        return;
      }
      try {
        const res = await service.get("/accommodation/own");
        if (!cancelled)
          setOwnCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        if (!cancelled) setOwnCount(0);
      }
    };
    fetchOwn();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (location.pathname === "/") setQuery("");
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    try {
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const goSearch = (city) => {
    const cityTrimmed = (city || query || "").trim();
    if (!cityTrimmed) {
      // Si no hay query, focus al input
      inputRef.current?.focus();
      return;
    }
    const cityFinal = cityTrimmed[0].toUpperCase() + cityTrimmed.slice(1);
    navigate(`/search?city=${encodeURIComponent(cityFinal)}`);
    setSearchOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  };

  const focusInput = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const hostLabel =
    isLoggedIn && ownCount > 0 ? "Sube otro alojamiento" : "Hazte anfitrión";

  const userMenu = (
    <Dropdown
      show={showMenu}
      onToggle={(isOpen) => setShowMenu(isOpen)}
      align="end"
    >
      <Dropdown.Toggle
        as="button"
        className="airb2b-menu-btn"
        aria-label="Menú de usuario"
      >
        <span className="airb2b-menu-burger" aria-hidden>
          ☰
        </span>
        <span className="airb2b-menu-avatar" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.582-8 6v2h16v-2c0-3.418-3.582-6-8-6z" />
          </svg>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="airb2b-menu" onClick={() => setShowMenu(false)}>
        {isLoggedIn ? (
          <>
            <Dropdown.Item as={Link} to="/myProfile">
              Perfil
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/myHouses">
              Mis alojamientos
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/favoriteshousing">
              Favoritos
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/myBookings">
              Mis reservas
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/myReviews">
              Mis reseñas
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item onClick={() => setShowLoginModal(true)}>
              Entrar o registrarme
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowHostModal(true)}>
              Hazte anfitrión
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  // ----- Buscador estilo Airbnb (píldora con 3 secciones) -----
  const renderSearchPill = () => (
    <div
      className={`airb2b-pill ${searchOpen ? "is-open" : ""}`}
      role="search"
    >
      <button
        type="button"
        className="airb2b-pill__section airb2b-pill__section--input"
        onClick={focusInput}
      >
        {searchOpen ? (
          <>
            <span className="airb2b-pill__label">¿Dónde?</span>
            <input
              ref={inputRef}
              type="text"
              className="airb2b-pill__input"
              placeholder="Busca destinos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              aria-label="Buscar ciudad"
            />
          </>
        ) : (
          <span className="airb2b-pill__placeholder">
            {query || "Cualquier lugar"}
          </span>
        )}
      </button>

      <span className="airb2b-pill__divider" />

      <button
        type="button"
        className="airb2b-pill__section"
        onClick={focusInput}
        title="Las fechas se eligen al reservar"
      >
        <span className="airb2b-pill__placeholder">Cualquier fecha</span>
      </button>

      <span className="airb2b-pill__divider" />

      <button
        type="button"
        className="airb2b-pill__section airb2b-pill__section--last"
        onClick={focusInput}
        title="Los viajeros se eligen al reservar"
      >
        <span className="airb2b-pill__placeholder airb2b-pill__placeholder--muted">
          Añade viajeros
        </span>
        <span
          className="airb2b-pill__btn"
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
            goSearch();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.5" />
            <path
              d="m21 21-4.3-4.3"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );

  return (
    <>
      <Navbar className="airb2b-navbar" id="navbar" sticky="top">
        <Container fluid className="airb2b-navbar-inner">
          {/* Desktop */}
          <div className="d-none d-lg-flex align-items-center w-100 airb2b-navbar-row">
            <Link to="/" className="airb2b-logo" aria-label="AirB2B inicio">
              <Image src="/logoair.png" height="56" alt="AirB2B" />
            </Link>

            <div className="airb2b-navbar-center">
              {renderSearchPill()}
            </div>

            <div className="airb2b-navbar-right">
              <Button
                variant="link"
                className="airb2b-host-link"
                onClick={() => setShowHostModal(true)}
              >
                {hostLabel}
              </Button>
              {userMenu}
            </div>
          </div>

          {/* Mobile / Tablet */}
          <div className="d-flex d-lg-none flex-column w-100">
            <div className="d-flex w-100 justify-content-between align-items-center mb-2">
              <Link to="/" className="airb2b-logo" aria-label="AirB2B inicio">
                <Image src="/logoair.png" height="42" alt="AirB2B" />
              </Link>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="airb2b-host-icon d-sm-none"
                  onClick={() => setShowHostModal(true)}
                  aria-label="Hazte anfitrión"
                  title="Hazte anfitrión"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z" />
                  </svg>
                </button>
                <Button
                  variant="link"
                  className="airb2b-host-link d-none d-sm-inline-flex"
                  onClick={() => setShowHostModal(true)}
                >
                  {hostLabel}
                </Button>
                {userMenu}
              </div>
            </div>
            <div className="w-100">{renderSearchPill()}</div>
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
