function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "transparent",
        textAlign: "center",
        padding: "10px 0",
        borderTop: "1px solid #ddd",
        fontSize: "14px",
        color: "#555",
        marginTop: "20px",
      }}
    >
      © {new Date().getFullYear()} AirB2B — Todos los derechos reservados.
    </footer>
  );
}

export default Footer;
