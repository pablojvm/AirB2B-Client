import { useMapEvents } from "react-leaflet";

function ClickMarker({ setClickedPosition }) {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      setClickedPosition([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
    },
  });
  return null;
}

export default ClickMarker;