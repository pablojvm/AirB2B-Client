import { useEffect, useState, useRef } from "react";
import { Button, Spinner } from "react-bootstrap";
import service from "../services/service.config";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // referencia al input oculto

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await service.get("/user/profile");
      setProfile(response.data ?? null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
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
  } catch (error) {
    console.error("Error uploading & saving image:", error);
    alert("Error subiendo la imagen. Inténtalo de nuevo.");
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};


  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const initial = profile?.username
    ? profile.username.charAt(0).toUpperCase()
    : "?";

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  const displayImage = profile?.photo ?? null;

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 32,
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Foto de perfil"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "48px",
              lineHeight: "120px",
              textAlign: "center",
              margin: "0 auto",
            }}
            aria-hidden
          >
            {initial}
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          disabled={isUploading}
        />

        {/* Botón que abre el selector */}
        <Button
          variant="light"
          onClick={handleChooseFile}
          disabled={isUploading}
          aria-busy={isUploading}
          style={{
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
          }}
        >
          <img src="/camara.png" width="20" alt="icono cámara" />
          {isUploading ? (
            <>
              <Spinner animation="border" size="sm" /> Subiendo...
            </>
          ) : (
            "Cambiar foto"
          )}
        </Button>
      </div>

      <div style={{ maxWidth: 500 }}>
        <h1 style={{ marginBottom: 12 }}>Mi Perfil</h1>
        <p style={{ color: "#555", fontSize: "1rem", lineHeight: "1.5" }}>
          Tu perfil puede aparecer en distintos lugares de la plataforma para
          fomentar la confianza dentro de nuestra comunidad. Podrán consultarlo
          tanto los anfitriones como los viajeros.
        </p>

        <h3 style={{ marginTop: 8 }}>{profile?.username ?? "Usuario"}</h3>
        <p style={{ color: "#666" }}>{profile?.email}</p>
      </div>
    </div>
  );
}

export default EditProfilePage;