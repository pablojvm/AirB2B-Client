function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="airb2b-footer">
      <div className="airb2b-footer__inner">
        <div>
          <strong className="airb2b-footer__brand">AirB2B</strong>
          <p className="airb2b-footer__tagline mb-0">
            Encuentra y publica alojamientos únicos en toda España.
          </p>
        </div>
        <div className="airb2b-footer__legal">
          <span>© {year} AirB2B</span>
          <span className="airb2b-footer__sep">·</span>
          <span>Proyecto académico</span>
          <span className="airb2b-footer__sep">·</span>
          <span>Hecho con ♥ para viajeros</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
