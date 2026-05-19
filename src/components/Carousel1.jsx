import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import CarouselSection from "./CarouselSection";

function Carousel1({ setShowLoginModal }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await service.get("/accommodation/popular");
        if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
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
      title="Alojamientos más populares"
      subtitle="Los que más eligen los viajeros"
      items={items}
      loading={loading}
      onRequireLogin={() => setShowLoginModal?.(true)}
    />
  );
}

export default Carousel1;
