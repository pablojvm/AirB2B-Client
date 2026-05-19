import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import CarouselSection from "./CarouselSection";

function Carousel4({ setShowLoginModal }) {
  const { favoritesFull = [], isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) return null;

  return (
    <CarouselSection
      title="Tus favoritos"
      subtitle="Los alojamientos que has guardado"
      items={favoritesFull}
      loading={false}
      emptyText="Aún no tienes favoritos. Pulsa el corazón para guardar un alojamiento."
      onRequireLogin={() => setShowLoginModal?.(true)}
    />
  );
}

export default Carousel4;
