import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import CarouselSection from "./CarouselSection";

function Carousel3({ setShowLoginModal }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await service.get("/accommodation/randomCity");
        const data = res.data;
        if (cancelled) return;
        if (Array.isArray(data?.accommodations)) {
          setItems(data.accommodations);
          setCity(data.city || "");
        } else if (Array.isArray(data)) {
          setItems(data);
          setCity("");
        } else {
          setItems([]);
          setCity("");
        }
      } catch (err) {
        console.error("Error cargando alojamientos:", err);
        navigate("/500");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <CarouselSection
      title={city ? `Descubre ${city}` : "Descubre nuevos destinos"}
      subtitle="Una ciudad distinta cada vez que vuelves"
      items={items}
      loading={loading}
      onRequireLogin={() => setShowLoginModal?.(true)}
    />
  );
}

export default Carousel3;
