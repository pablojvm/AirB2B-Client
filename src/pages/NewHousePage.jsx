import { Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import ClickMarker from "../components/ClickMarker";
import service from "../services/service.config";

function NewHousePage() {
  const [center, setCenter] = useState([51.505, -0.09]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(1);
  const [value3, setValue3] = useState(1);
  const [value4, setValue4] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleIncrease1 = () => setValue1(value1 + 1);
  const handleDecrease1 = () => value1 > 0 && setValue1(value1 - 1);

  const handleIncrease2 = () => setValue2(value2 + 1);
  const handleDecrease2 = () => value2 > 0 && setValue2(value2 - 1);

  const handleIncrease3 = () => setValue3(value3 + 1);
  const handleDecrease3 = () => value3 > 0 && setValue3(value3 - 1);

  const handleIncrease4 = () => setValue4(value4 + 1);
  const handleDecrease4 = () => value4 > 0 && setValue4(value4 - 1);

  const handleFileUpload = async (event) => {

    if (!event.target.files[0]) {
      return;
    }
    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("image", event.target.files[0]);
   
    try {
      const response = await service.post("/upload", uploadData)
      setImageUrl(response.data.imageUrl)
      setIsUploading(false)
    } catch (error) {
      navigate("/error");
    }
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

  return (
    <div>
      <div
        id="firstPage"
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>1. Describe tu espacio</h3>
              <p>
                Añade algunos datos básicos, como dónde está y cuántos viajeros
                pueden quedarse.
              </p>
            </div>
            <img src="/foto3.png" width="200px" alt="Paso 1" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>2. Añade todos los detalles</h3>
              <p>
                Añade al menos cinco fotos, un título y una descripción. Te
                echaremos una mano.
              </p>
            </div>
            <img src="/foto2.png" width="200px" alt="Paso 2" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>3. Últimos retoques y publícalo</h3>
              <p>
                Elige un precio inicial, verifica algunos detalles y publica tu
                anuncio.
              </p>
            </div>
            <img src="/foto1.png" width="200px" alt="Paso 3" />
          </div>
        </div>
      </div>
      <div id="secondPage" style={{ padding: "40px" }}>
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
              variant="outline-secondary"
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <img
                src={imgSrc}
                alt={name}
                width="100px"
                height="100px"
                style={{ objectFit: "contain" }}
              />
              {name}
            </Button>
          ))}
        </div>
      </div>
      <div id="thirdPage">
        <h1>¿Donde se encuentra tu alojamiento?"</h1>
        <Form.Group className="mb-3" controlId="Adress">
          <Form.Label>Introduce tu dirección exacta</Form.Label>
          <Form.Control type="adress" placeholder="Adress" />
        </Form.Group>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker setClickedPosition={setClickedPosition} />
          {clickedPosition !== null && <Marker position={clickedPosition} />}
        </MapContainer>
        ;
      </div>
      <div id="fourthPage">
        <h1>Comencemos por lo básico</h1>
        <h4>¿Cuantas personas pueden quedarse?</h4>
        <div style={{ display: "flex" }}>
          <p>Personas</p>{" "}
          <InputGroup style={{ width: "150px" }}>
            <Button variant="outline-secondary" onClick={handleDecrease1}>
              –
            </Button>
            <FormControl
              type="number"
              value={value1}
              onChange={(e) => setValue1(Number(e.target.value))}
              style={{ textAlign: "center" }}
            />
            <Button variant="outline-secondary" onClick={handleIncrease1}>
              +
            </Button>
          </InputGroup>
          <hr />
        </div>
        <div style={{ display: "flex" }}>
          <p>Habitaciones</p>
          <InputGroup style={{ width: "150px" }}>
            <Button variant="outline-secondary" onClick={handleDecrease2}>
              –
            </Button>
            <FormControl
              type="number"
              value={value2}
              onChange={(e) => setValue2(Number(e.target.value))}
              style={{ textAlign: "center" }}
            />
            <Button variant="outline-secondary" onClick={handleIncrease2}>
              +
            </Button>
          </InputGroup>
          <hr />
        </div>
        <div style={{ display: "flex" }}>
          <p>Camas</p>{" "}
          <InputGroup style={{ width: "150px" }}>
            <Button variant="outline-secondary" onClick={handleDecrease3}>
              –
            </Button>
            <FormControl
              type="number"
              value={value3}
              onChange={(e) => setValue3(Number(e.target.value))}
              style={{ textAlign: "center" }}
            />
            <Button variant="outline-secondary" onClick={handleIncrease3}>
              +
            </Button>
          </InputGroup>
          <hr />
        </div>
      </div>
      <div id="fithPage">
        <h1>¿Cuantos baños tiene el alojamiento?</h1>
        <div style={{ display: "flex" }}>
          <p>Baños</p>
          <InputGroup style={{ width: "150px" }}>
            <Button variant="outline-secondary" onClick={handleDecrease3}>
              –
            </Button>
            <FormControl
              type="number"
              value={value4}
              onChange={(e) => setValue4(Number(e.target.value))}
              style={{ textAlign: "center" }}
            />
            <Button variant="outline-secondary" onClick={handleIncrease4}>
              +
            </Button>
          </InputGroup>
        </div>
      </div>
      <div id="sixPage" style={{ padding: "40px" }}>
        <h1>Cuentale a los viajeros todo lo que ofrece tu espacio</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {Object.entries(services).map(([name, imgSrc]) => (
            <Button
              key={name}
              variant="outline-secondary"
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <img
                src={imgSrc}
                alt={name}
                width="100px"
                height="100px"
                style={{ objectFit: "contain" }}
              />
              {name}
            </Button>
          ))}
        </div>
      </div>
      <div id="seventhPage">
        <h1>Añade algunas imágenes de tu alojamiento</h1>
        <div>
          <div>
            <label>Image: </label>
            <input
              type="file"
              name="image"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          {isUploading ? <h3>... uploading image</h3> : null}
          {imageUrl ? (
            <div>
              <img src={imageUrl} alt="img" width={200} />
            </div>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <Button variant="secondary">Atras</Button>
        <Button variant="secondary">Siguiente</Button>
      </div>
    </div>
  );
}

export default NewHousePage;
