import {
  Button,
  Form,
  InputGroup,
  FormControl,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState } from "react";
import ClickMarker from "../components/ClickMarker";
import service from "../services/service.config";
import { useNavigate } from "react-router-dom";

function NewHousePage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  const [center] = useState([40.4169, -3.7034]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(1);
  const [value3, setValue3] = useState(1);
  const [value4, setValue4] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [typeHouse, setTypeHouse] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleIncrease1 = () => setValue1((v) => v + 1);
  const handleDecrease1 = () => setValue1((v) => (v > 0 ? v - 1 : 0));

  const handleIncrease2 = () => setValue2((v) => v + 1);
  const handleDecrease2 = () => setValue2((v) => (v > 0 ? v - 1 : 0));

  const handleIncrease3 = () => setValue3((v) => v + 1);
  const handleDecrease3 = () => setValue3((v) => (v > 0 ? v - 1 : 0));

  const handleIncrease4 = () => setValue4((v) => v + 1);
  const handleDecrease4 = () => setValue4((v) => (v > 0 ? v - 1 : 0));

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadData = new FormData();
        uploadData.append("image", file);

        const response = await service.post("/upload", uploadData);
        if (response.data.imageUrl) uploadedUrls.push(response.data.imageUrl);
        else if (response.data.imageUrls)
          uploadedUrls.push(...response.data.imageUrls);
        else console.warn("Respuesta inesperada de /upload:", response.data);
      }
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
      setSubmitError("Error subiendo imágenes. Revisa la consola.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleService = (serviceName) => {
    setSelectedServices((prev) => {
      const copy = new Set(prev);
      if (copy.has(serviceName)) copy.delete(serviceName);
      else copy.add(serviceName);
      return copy;
    });
  };

  const typesHouses = {
    Apartment: "/1apartment.png",
    House: "/1house.png",
    Cabin: "/1cabin.png",
    Bungalow: "/1bungalow.png",
    Guesthouse: "/1guesthouse.png",
    Hotel: "/1hotel.png",
    "Bed and Breakfast": "/1bedbreakfast.png",
    "Farm stay": "/1farm.png",
    Boat: "/1boat.png",
    Treehouse: "/1treehouse.png",
    Castle: "/1castle.png",
    "Camper/RV": "/1camper.png",
  };

  const services = {
    "Wi-Fi": "/wifi.png",
    "Air conditioning": "/aire.png",
    Heating: "/radiador.png",
    TV: "/tv.png",
    Washer: "/washer.png",
    Dryer: "/dryer.png",
    Kitchen: "/kitchen.png",
    "Private bathroom": "/bathroom.png",
    "Hair dryer": "/hairDryer.png",
    Shampoo: "/shampoo.png",
    Towels: "/towels.png",
    Iron: "/iron.png",
    Parking: "/parking.png",
    Pool: "/pool.png",
    Gym: "/gym.png",
    "Hot tub": "/jacuzzi.png",
    Balcony: "/balcon.png",
    Garden: "/jardin.png",
    "BBQ grill": "/barbacoa.png",
    Fireplace: "/chimenea.png",
    "Pet friendly": "/pet.png",
    "Smoke detector": "/detector.png",
    "First aid kit": "/botiquin.png",
    Workspace: "/workspace.png",
    "Breakfast included": "/desayuno.png",
    "24h check-in": "/checking.png",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!typeHouse) return setSubmitError("Selecciona el tipo de alojamiento.");
    if (!address || address.trim().length < 3)
      return setSubmitError("Introduce una dirección válida.");
    if (!title || title.trim().length < 5)
      return setSubmitError("Pon un título (mínimo 5 caracteres).");
    if (!description || description.trim().length < 10)
      return setSubmitError("Pon una descripción (mínimo 10 caracteres).");
    if (!price || price <= 0)
      return setSubmitError("Define un precio mayor que 0.");
    if (imageUrls.length < 1)
      return setSubmitError("Sube al menos una imagen.");

    const locationPayload = clickedPosition
      ? { type: "Point", coordinates: [clickedPosition[1], clickedPosition[0]] }
      : null;

    const body = {
      title: title.trim(),
      maxPeople: Number(value1),
      type: typeHouse,
      beds: Number(value3),
      bedrooms: Number(value2),
      bathrooms: Number(value4),
      livingroom: 0,
      services: Array.from(selectedServices),
      cost: Number(price),
      photos: imageUrls,
      description: description.trim(),
      location: locationPayload,
      city: city,
    };

    try {
      setIsSubmitting(true);
      const response = await service.post("/accommodation", body);
      setSubmitSuccess("Alojamiento creado correctamente.");
      const created = response.data;
      const newId = created._id || created.id;
      if (newId) navigate(`/housingdetails/${newId}`);
      else navigate("/myhouses");
    } catch (error) {
      console.error("Error creando alojamiento:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errorMessage ||
        null;
      setSubmitError(
        msg || "Error al crear el alojamiento. Revisa la consola."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    setSubmitError("");
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    setSubmitError("");
    if (currentStep > 1) setCurrentStep((s) => s - 1);
    else navigate(-1);
  };

  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ paddingBottom: 40 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "20px 40px" }}>
          <ProgressBar now={progress} label={`${currentStep}/${totalSteps}`} />
        </div>
        {currentStep === 1 && (
          <section id="firstPage" style={{ padding: "20px 40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "40px",
              }}
            >
              <div>
                <h1>Empezar en AirB2B es muy sencillo</h1>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>1. Describe tu espacio</h3>
                    <p>
                      Añade algunos datos básicos, como dónde está y cuántos
                      viajeros pueden quedarse.
                    </p>
                  </div>
                  <img src="/foto3.png" width="200px" alt="Paso 1" />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>2. Añade todos los detalles</h3>
                    <p>
                      Añade al menos cinco fotos, un título y una descripción.
                      Te echaremos una mano.
                    </p>
                  </div>
                  <img src="/foto2.png" width="200px" alt="Paso 2" />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>3. Últimos retoques y publícalo</h3>
                    <p>
                      Elige un precio inicial, verifica algunos detalles y
                      publica tu anuncio.
                    </p>
                  </div>
                  <img src="/foto1.png" width="200px" alt="Paso 3" />
                </div>
              </div>
            </div>
          </section>
        )}
        {currentStep === 2 && (
          <section id="secondPage" style={{ padding: "20px 40px" }}>
            <h1>¿Cuál de estas opciones describe mejor tu alojamiento?</h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {Object.entries(typesHouses).map(([name, imgSrc]) => (
                <Button
                  key={name}
                  variant={typeHouse === name ? "primary" : "outline-secondary"}
                  onClick={() => setTypeHouse(name)}
                  style={{
                    width: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  type="button"
                >
                  <img
                    src={imgSrc}
                    alt={name}
                    width="80"
                    height="80"
                    style={{ objectFit: "contain" }}
                  />
                  {name}
                </Button>
              ))}
            </div>
          </section>
        )}
        {currentStep === 3 && (
          <section id="thirdPage" style={{ padding: "20px 40px" }}>
            <h1>¿Dónde se encuentra tu alojamiento?</h1>
            <Form.Group className="mb-3" controlId="Adress">
              <Form.Label>Introduce tu dirección exacta</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="City">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
                placeholder="Ciudad"
              />
              <Form.Text className="text-muted">
                La primera letra se escribirá automáticamente en mayúscula.
              </Form.Text>
            </Form.Group>
            <MapContainer
              center={center}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickMarker setClickedPosition={setClickedPosition} />
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
            </MapContainer>
            <small className="text-muted">
              Haz click en el mapa para fijar la localización exacta.
            </small>
          </section>
        )}
        {currentStep === 4 && (
          <section id="fourthPage" style={{ padding: "20px 40px" }}>
            <h4>Comencemos por lo básico</h4>
            <p>¿Cuantas personas pueden quedarse?</p>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label>Personas</label>
                <InputGroup style={{ width: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleDecrease1}
                    type="button"
                  >
                    –
                  </Button>
                  <FormControl
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(Number(e.target.value))}
                    style={{ textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleIncrease1}
                    type="button"
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label>Habitaciones</label>
                <InputGroup style={{ width: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleDecrease2}
                    type="button"
                  >
                    –
                  </Button>
                  <FormControl
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(Number(e.target.value))}
                    style={{ textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleIncrease2}
                    type="button"
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label>Camas</label>
                <InputGroup style={{ width: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleDecrease3}
                    type="button"
                  >
                    –
                  </Button>
                  <FormControl
                    type="number"
                    value={value3}
                    onChange={(e) => setValue3(Number(e.target.value))}
                    style={{ textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleIncrease3}
                    type="button"
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label>Baños</label>
                <InputGroup style={{ width: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleDecrease4}
                    type="button"
                  >
                    –
                  </Button>
                  <FormControl
                    type="number"
                    value={value4}
                    onChange={(e) => setValue4(Number(e.target.value))}
                    style={{ textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleIncrease4}
                    type="button"
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
            </div>
          </section>
        )}
        {currentStep === 5 && (
          <section id="fivePage" style={{ padding: "20px 40px" }}>
            <h1>Cuéntale a los viajeros todo lo que ofrece tu espacio</h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {Object.entries(services).map(([name, imgSrc]) => {
                const active = selectedServices.has(name);
                return (
                  <Button
                    key={name}
                    variant={active ? "primary" : "outline-secondary"}
                    onClick={() => toggleService(name)}
                    type="button"
                    style={{
                      width: "180px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={name}
                      width="70"
                      height="70"
                      style={{ objectFit: "contain" }}
                    />
                    {name}
                  </Button>
                );
              })}
            </div>
          </section>
        )}
        {currentStep === 6 && (
          <section id="sixthPage" style={{ padding: "20px 40px" }}>
            <h1>Añade algunas imágenes de tu alojamiento</h1>
            <div style={{ marginBottom: "8px" }}>
              <label>Imágenes: </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <div>
                <Spinner animation="border" size="sm" /> Subiendo...
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              {imageUrls.map((url, i) => (
                <div key={`${url}-${i}`} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`img-${i}`}
                    width={160}
                    style={{ borderRadius: "12px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 26,
                      height: 26,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {currentStep === 7 && (
          <section id="seventhPage" style={{ padding: "20px 40px" }}>
            <h1>Ponle un título a tu alojamiento</h1>
            <p>
              Los títulos cortos dan mejor resultado. No te preocupes, puedes
              cambiarlo más adelante.
            </p>
            <Form.Control
              as="textarea"
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>
        )}
        {currentStep === 8 && (
          <section id="eigthPage" style={{ padding: "20px 40px" }}>
            <h1>Escribe tu descripción</h1>
            <p>Explica qué hace que tu alojamiento sea especial.</p>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>
        )}
        {currentStep === 9 && (
          <section id="ninePage" style={{ padding: "20px 40px" }}>
            <h1>Configura un precio base para tu alojamiento</h1>
            <p>Define el precio por día en euros.</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <InputGroup style={{ width: "12ch", justifyContent: "center" }}>
                <InputGroup.Text
                  style={{
                    fontSize: "2.2rem",
                    padding: "0.25rem 0.5rem",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  €
                </InputGroup.Text>
                <FormControl
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="border-0 text-center fw-bold"
                  style={{
                    fontSize: "2.6rem",
                    background: "transparent",
                    padding: "0.25rem 0.5rem",
                  }}
                  min={0}
                />
              </InputGroup>
            </div>
          </section>
        )}

        <div style={{ padding: "20px 40px" }}>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 40px",
            position: "sticky",
            bottom: 0,
            background: "white",
          }}
        >
          <Button variant="secondary" type="button" onClick={goBack}>
            {currentStep > 1 ? "Atrás" : "Volver"}
          </Button>
          <div>
            {currentStep < totalSteps && (
              <Button
                variant="outline-secondary"
                onClick={goNext}
                type="button"
                style={{ marginRight: 8 }}
              >
                Siguiente
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" /> Creando...
                  </>
                ) : (
                  "Publicar alojamiento"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewHousePage;
