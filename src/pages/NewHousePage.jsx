import { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  FormControl,
  Spinner,
  Alert,
  ProgressBar,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import ClickMarker from "../components/ClickMarker";
import service from "../services/service.config";

const TYPES = {
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

const SERVICES = {
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

const customMarker = L.icon({
  iconUrl: "/marker.png",
  iconSize: [48, 76],
  iconAnchor: [24, 76],
  popupAnchor: [0, -76],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 12);
  }, [lat, lng, map]);
  return null;
}

function Stepper({ label, value, onChange, min = 0 }) {
  return (
    <div className="stepper-row">
      <span className="stepper-row__label">{label}</span>
      <InputGroup className="stepper-row__group">
        <Button
          variant="outline-secondary"
          onClick={() => onChange(Math.max(min, value - 1))}
          type="button"
          aria-label={`Disminuir ${label}`}
          className="stepper-btn"
        >
          –
        </Button>
        <FormControl
          type="number"
          value={value}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          className="stepper-input"
        />
        <Button
          variant="outline-secondary"
          onClick={() => onChange(value + 1)}
          type="button"
          aria-label={`Aumentar ${label}`}
          className="stepper-btn"
        >
          +
        </Button>
      </InputGroup>
    </div>
  );
}

function NewHousePage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  const [mapPosition] = useState([40.4169, -3.7034]);
  const [cityCoords, setCityCoords] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [people, setPeople] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
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
  const mapRef = useRef(null);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        data.append("image", files[i]);
        const response = await service.post("/upload", data);
        if (response.data.imageUrl) uploaded.push(response.data.imageUrl);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Error al subir las imágenes:", err);
      setSubmitError("Error subiendo imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleService = (s) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const handleCitySearch = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${city}, Spain`
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCityCoords([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Ciudad no encontrada");
      }
    } catch (err) {
      console.error("Error buscando ciudad:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!typeHouse) return setSubmitError("Selecciona el tipo de alojamiento.");
    if (!address || address.trim().length < 3)
      return setSubmitError("Introduce una dirección válida.");
    if (!city || city.trim().length < 2)
      return setSubmitError("Indica la ciudad.");
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
      maxPeople: Number(people),
      type: typeHouse,
      beds: Number(beds),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      livingroom: 0,
      services: Array.from(selectedServices),
      cost: Number(price),
      photos: imageUrls,
      description: description.trim(),
      location: locationPayload,
      city: city.trim(),
    };

    try {
      setIsSubmitting(true);
      await service.post("/accommodation", body);
      setSubmitSuccess("Alojamiento creado correctamente.");
      navigate("/myHouses");
    } catch (err) {
      console.error("Error creando alojamiento:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errorMessage ||
        "Error al crear el alojamiento.";
      setSubmitError(msg);
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
    <div className="new-house-page">
      <div className="new-house-page__progress">
        <Container>
          <ProgressBar now={progress} className="new-house-page__bar" />
          <div className="new-house-page__step-text">
            Paso {currentStep} de {totalSteps}
          </div>
        </Container>
      </div>

      <Container className="new-house-page__form" as="form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <section className="step">
            <h1 className="step__title">Empezar en AirB2B es muy sencillo</h1>
            <p className="step__subtitle">
              Tres pasos para tener tu primer anuncio en línea.
            </p>
            <Row className="g-4 mt-2">
              {[
                {
                  title: "1. Describe tu espacio",
                  text: "Añade datos básicos, como dónde está y cuántos huéspedes admite.",
                  img: "/foto3.png",
                },
                {
                  title: "2. Añade los detalles",
                  text: "Sube fotos, escribe un título y una descripción.",
                  img: "/foto2.png",
                },
                {
                  title: "3. Publícalo",
                  text: "Elige un precio inicial, revisa y publica.",
                  img: "/foto1.png",
                },
              ].map((step) => (
                <Col xs={12} md={4} key={step.title}>
                  <div className="step-card">
                    <img src={step.img} alt="" />
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {currentStep === 2 && (
          <section className="step">
            <h1 className="step__title">¿Qué tipo de alojamiento es?</h1>
            <p className="step__subtitle">Elige el que mejor lo describa.</p>
            <div className="type-grid mt-3">
              {Object.entries(TYPES).map(([name, imgSrc]) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setTypeHouse(name)}
                  className={`type-card ${typeHouse === name ? "is-active" : ""}`}
                  aria-pressed={typeHouse === name}
                >
                  <img src={imgSrc} alt="" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="step">
            <h1 className="step__title">¿Dónde se encuentra?</h1>
            <p className="step__subtitle">
              Solo compartimos la ubicación exacta con los huéspedes confirmados.
            </p>

            <Row className="g-3 mt-3">
              <Col md={6}>
                <Form.Group controlId="address">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle y número"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="city">
                  <Form.Label>Ciudad</Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={city}
                      onChange={(e) =>
                        setCity(
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1)
                        )
                      }
                      placeholder="Ej: Madrid"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCitySearch();
                        }
                      }}
                    />
                    <Button
                      variant="outline-dark"
                      onClick={handleCitySearch}
                      type="button"
                    >
                      Buscar
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <div className="new-house-map mt-3">
              <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={false}
                ref={mapRef}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickMarker setClickedPosition={setClickedPosition} />
                {clickedPosition && (
                  <Marker position={clickedPosition} icon={customMarker} />
                )}
                {cityCoords && (
                  <RecenterMap lat={cityCoords[0]} lng={cityCoords[1]} />
                )}
              </MapContainer>
            </div>
            <small className="text-muted d-block mt-2">
              Haz click en el mapa para fijar la localización exacta.
            </small>
          </section>
        )}

        {currentStep === 4 && (
          <section className="step">
            <h1 className="step__title">Comencemos por lo básico</h1>
            <p className="step__subtitle">¿Cuántas personas pueden quedarse?</p>
            <div className="steppers mt-3">
              <Stepper label="Huéspedes" value={people} onChange={setPeople} min={1} />
              <Stepper label="Habitaciones" value={bedrooms} onChange={setBedrooms} />
              <Stepper label="Camas" value={beds} onChange={setBeds} min={1} />
              <Stepper label="Baños" value={bathrooms} onChange={setBathrooms} />
            </div>
          </section>
        )}

        {currentStep === 5 && (
          <section className="step">
            <h1 className="step__title">¿Qué ofrece tu espacio?</h1>
            <p className="step__subtitle">Marca todo lo que esté disponible.</p>
            <div className="service-grid mt-3">
              {Object.entries(SERVICES).map(([name, imgSrc]) => {
                const active = selectedServices.has(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => toggleService(name)}
                    className={`service-card ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                  >
                    <img src={imgSrc} alt="" />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {currentStep === 6 && (
          <section className="step">
            <h1 className="step__title">Añade imágenes</h1>
            <p className="step__subtitle">Recomendamos al menos 5 fotos.</p>

            <div className="upload-area">
              <label htmlFor="imgs" className="upload-area__label">
                <strong>Arrastra o pulsa para subir</strong>
                <span>JPG, PNG o WebP — máx. 5 MB cada una</span>
                <input
                  id="imgs"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  hidden
                />
              </label>
              {isUploading && (
                <div className="upload-area__status">
                  <Spinner animation="border" size="sm" /> Subiendo…
                </div>
              )}
            </div>

            {imageUrls.length > 0 && (
              <div className="upload-grid mt-3">
                {imageUrls.map((url, i) => (
                  <div key={`${url}-${i}`} className="upload-grid__item">
                    <img src={url} alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="upload-grid__remove"
                      aria-label="Quitar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {currentStep === 7 && (
          <section className="step">
            <h1 className="step__title">Ponle un título</h1>
            <p className="step__subtitle">
              Los títulos cortos funcionan mejor. Lo puedes cambiar después.
            </p>
            <Form.Control
              as="textarea"
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Ej: Apartamento luminoso con vistas al mar"
              className="big-input mt-3"
            />
            <small className="text-muted">{title.length}/120</small>
          </section>
        )}

        {currentStep === 8 && (
          <section className="step">
            <h1 className="step__title">Escribe tu descripción</h1>
            <p className="step__subtitle">
              Explica qué hace especial a tu espacio.
            </p>
            <Form.Control
              as="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el alojamiento, el barrio, qué pueden esperar…"
              className="big-input mt-3"
            />
          </section>
        )}

        {currentStep === 9 && (
          <section className="step">
            <h1 className="step__title">¿A qué precio?</h1>
            <p className="step__subtitle">
              Indica el precio por noche en euros. Lo podrás ajustar siempre.
            </p>
            <div className="price-input">
              <span className="price-input__currency">€</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                aria-label="Precio por noche"
              />
            </div>
          </section>
        )}

        {submitError && (
          <Alert variant="danger" className="mt-4">
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert variant="success" className="mt-4">
            {submitSuccess}
          </Alert>
        )}
      </Container>

      <div className="new-house-page__nav">
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="link" className="text-dark" onClick={goBack} type="button">
            {currentStep > 1 ? "← Atrás" : "Cancelar"}
          </Button>
          <div>
            {currentStep < totalSteps && (
              <Button
                onClick={goNext}
                type="button"
                className="airb2b-btn-primary"
              >
                Siguiente
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button
                type="submit"
                className="airb2b-btn-primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" /> Publicando…
                  </>
                ) : (
                  "Publicar alojamiento"
                )}
              </Button>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default NewHousePage;
