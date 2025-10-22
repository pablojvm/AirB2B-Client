// import { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import axios from 'axios';

// export default function BookingCalendar({ itemId, userId }) {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     // obtener reservas para pintar
//     async function load() {
//       const res = await axios.get(`/bookings?itemId=${itemId}`);
//       // convertir a eventos de FullCalendar
//       const ev = res.data.map(b => ({
//         id: b._id,
//         title: 'Reservado',
//         start: b.start,
//         end: b.end,
//         allDay: true,
//         color: '#ff8080'
//       }));
//       setEvents(ev);
//     }
//     load();
//   }, [itemId]);

//   const handleSelect = async (selectionInfo) => {
//     const start = selectionInfo.startStr;
//     const end = selectionInfo.endStr; // end es exclusivo en FullCalendar
//     // comprobar disponibilidad
//     const check = await axios.post('/bookings/check', { itemId, start, end });
//     if (!check.data.available) {
//       alert('Fechas no disponibles');
//       return;
//     }
//     // confirmar reserva (mostrar modal / pedir datos)
//     if (!window.confirm(`Reservar desde ${start} hasta ${end}?`)) return;

//     try {
//       const res = await axios.post('/bookings', { itemId, userId, start, end });
//       // añadir evento localmente
//       setEvents(prev => [...prev, { id: res.data._id, title: 'Tu reserva', start: res.data.start, end: res.data.end, allDay: true }]);
//       alert('Reserva confirmada');
//     } catch (err) {
//       if (err.response && err.response.status === 409) alert('Conflicto al guardar, inténtalo otra vez');
//       else alert('Error creando reserva');
//     }
//   };

//   return (
//     <FullCalendar
//       plugins={[ dayGridPlugin, interactionPlugin ]}
//       initialView="dayGridMonth"
//       selectable={true}
//       selectMirror={true}
//       select={handleSelect}
//       events={events}
//     />
//   );
// }
// calendario a modo de ejemplo