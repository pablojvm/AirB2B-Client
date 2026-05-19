import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

/**
 * Tarjeta de alojamiento. La imagen y el título son enlaces independientes
 * para evitar anidar <button> dentro de <a> (HTML inválido).
 */
function HousingCard({ acc, onRequireLogin, showFavorite = true, extra = null }) {
  const { favorites = [], toggleFavorite, isLoggedIn } = useContext(AuthContext);
  if (!acc) return null;

  const isFav = favorites.includes(acc._id);
  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    toggleFavorite(acc._id);
  };

  const photo = acc.photos?.[0] || "/imagenpre.webp";
  const pricePerNight = Number(acc.cost ?? 0);
  const detailHref = `/housingdetails/${acc._id}`;

  return (
    <article className="housing-card">
      <div className="housing-card__media">
        <Link
          to={detailHref}
          aria-label={`Ver ${acc.title || "alojamiento"}`}
          className="housing-card__media-link"
        >
          <img
            src={photo}
            alt={acc.title || "Alojamiento"}
            loading="lazy"
            className="housing-card__img"
          />
        </Link>

        {showFavorite && (
          <button
            type="button"
            onClick={handleFavClick}
            className={`housing-card__fav ${isFav ? "is-active" : ""}`}
            aria-pressed={isFav}
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 21s-7-4.534-9.5-9.045C.79 8.523 2.5 4.5 6.5 4.5c2.063 0 3.514 1.16 4.5 2.5C12 5.66 13.437 4.5 15.5 4.5c4 0 5.71 4.023 4 7.455C19 16.466 12 21 12 21z"
                fill={isFav ? "#FF385C" : "rgba(0,0,0,0.5)"}
                stroke="#fff"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="housing-card__body">
        <Link to={detailHref} className="housing-card__title-link">
          <h3 className="housing-card__title" title={acc.title}>
            {acc.title || "Alojamiento sin título"}
          </h3>
        </Link>
        {acc.city && <p className="housing-card__city">{acc.city}</p>}
        <p className="housing-card__price">
          <strong>{pricePerNight}€</strong>
          <span className="housing-card__price-unit"> noche</span>
        </p>
        {extra}
      </div>
    </article>
  );
}

export default HousingCard;
