/**
 * Estado vacío reutilizable: icono SVG + título + texto + acción opcional.
 * Centrado, sin Alert de Bootstrap.
 */
function EmptyState({ icon, title, text, action, variant = "default" }) {
  return (
    <div className={`empty-state empty-state--${variant}`}>
      <div className="empty-state__icon" aria-hidden>
        {icon}
      </div>
      {title && <h3 className="empty-state__title">{title}</h3>}
      {text && <p className="empty-state__text">{text}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

/* Iconos SVG reutilizables — line icons monocromáticos */
export const SuitcaseIcon = (
  <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="18" width="48" height="36" rx="4" />
    <path d="M22 18v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" />
    <path d="M8 30h48" />
    <path d="M22 30v24M42 30v24" />
  </svg>
);

export const HouseIcon = (
  <svg viewBox="0 0 64 64" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 28 32 8l24 20" />
    <path d="M14 26v28h36V26" />
    <path d="M26 54V38h12v16" />
  </svg>
);

export const HeartIcon = (
  <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 56s-22-12-22-28a12 12 0 0 1 22-7 12 12 0 0 1 22 7c0 16-22 28-22 28z" />
  </svg>
);

export const CalendarIcon = (
  <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="14" width="48" height="42" rx="4" />
    <path d="M8 26h48" />
    <path d="M22 8v12M42 8v12" />
    <circle cx="22" cy="38" r="2" fill="currentColor" />
    <circle cx="32" cy="38" r="2" fill="currentColor" />
    <circle cx="42" cy="38" r="2" fill="currentColor" />
  </svg>
);

export const ChatBubbleIcon = (
  <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14h40a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H24l-12 10V18a4 4 0 0 1 4-4z" />
    <path d="M22 26h20M22 34h14" />
  </svg>
);

export default EmptyState;
