import { useEffect, useState, useRef } from "react";
import { Container, Button, Spinner, Alert, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import service from "../services/service.config";

function EditProfilePage() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const [usernameDraft, setUsernameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [numberDraft, setNumberDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await service.get("/user/profile");
        if (cancelled) return;
        setProfile(response.data || null);
        setUsernameDraft(response.data?.username || "");
        setEmailDraft(response.data?.email || "");
        setNumberDraft(response.data?.number || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (!cancelled) setError("No se pudo cargar el perfil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append("image", file);
    try {
      const uploadRes = await service.post("/upload", uploadData);
      const imageUrl = uploadRes.data?.imageUrl;
      if (!imageUrl) throw new Error("No imageUrl returned from upload");

      const saveRes = await service.patch("/user/profile", { photo: imageUrl });
      if (saveRes.data?.user) {
        setProfile(saveRes.data.user);
      } else {
        setProfile((prev) => (prev ? { ...prev, photo: imageUrl } : prev));
      }
      setSuccess("Foto actualizada");
    } catch (err) {
      console.error("Error uploading & saving image:", err);
      setError(
        err?.response?.data?.errorMessage ||
          "Error subiendo la imagen. Inténtalo de nuevo."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    setError(null);
    setSuccess(null);
    try {
      const saveRes = await service.patch("/user/profile", {
        username: usernameDraft,
        email: emailDraft,
        number: numberDraft,
      });
      setProfile(saveRes.data?.user || profile);
      setSuccess("Perfil actualizado");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errorMessage ||
          "No se pudo guardar el perfil."
      );
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChooseFile = () => fileInputRef.current?.click();

  const initial = profile?.username
    ? profile.username.charAt(0).toUpperCase()
    : "?";

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4 edit-profile" style={{ maxWidth: 720 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Editar perfil</h1>
        <Button as={Link} to="/myProfile" variant="outline-dark" size="sm">
          Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="d-flex align-items-center gap-4">
          <div className="edit-profile__avatar">
            {profile?.photo ? (
              <img src={profile.photo} alt="Foto de perfil" />
            ) : (
              <div className="edit-profile__avatar--initial">{initial}</div>
            )}
          </div>
          <div>
            <h5 className="mb-1">{profile?.username || "Usuario"}</h5>
            <p className="text-muted small mb-2">
              Una foto ayuda a generar confianza en la comunidad.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              variant="outline-dark"
              size="sm"
              onClick={handleChooseFile}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" /> Subiendo…
                </>
              ) : (
                "Cambiar foto"
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Datos personales</h5>
          <Form onSubmit={handleSaveDetails}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="number">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={numberDraft}
                onChange={(e) => setNumberDraft(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              className="airb2b-btn-primary"
              disabled={savingDetails}
            >
              {savingDetails ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProfilePage;
