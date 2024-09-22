import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEventContext } from "@/app/context/eventcontext"; // Importar el hook para acceder al contexto
import L from "leaflet";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Importar autoTable

// Crear ícono personalizado para los marcadores
const createCustomIcon = (size: number) =>
  L.divIcon({
    className:
      "bg-red-500 rounded-full border-4 border-red-200 hover:bg-green-500 hover:border-green-200 transition-all duration-300 ease-in-out",
    iconSize: [size, size], // Ajustar el tamaño del icono
  });

// Componente para centrar el mapa
function SetMapCenter({
  lat,
  lng,
  zoom,
}: {
  lat: number;
  lng: number;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], zoom); // Centramos el mapa en las coordenadas dadas con el zoom
    }
  }, [lat, lng, zoom, map]);

  return null; // Este componente no necesita renderizar nada
}

export default function EventMap({
  center,
  zoom,
  startDate,
  endDate,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const { events, loading, error, removeEvent } = useEventContext(); // Usar eventos del contexto

  // Filtrar eventos por rango de fechas
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.fecha);
    if (startDate && endDate) {
      return eventDate >= startDate && eventDate <= endDate;
    }
    return true; // Si no hay fechas, devolver todos los eventos
  });

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este evento?");
    if (!confirmed) return;

    try {
      await fetch(`/api/eventos/${eventId}`, {
        method: "DELETE",
      });
      removeEvent(eventId);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  // Función para generar y descargar el PDF con tabla
  const handleDownloadPDF = (event: any) => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text("Detalles del Evento", 10, 10);

    // Datos del evento en una tabla
    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: [
        ["Evento", event.evento],
        ["Causa", event.causa],
        ["Magnitud", event.magnitud],
        ["Ubicación Sector", event.ubicacionSector],
        ["Afectaciones", event.afectaciones],
        ["Descripción Afectación", event.descripcionAfectacion],
        ["Tipo de Manejo", event.tipoManejo],
        ["Tipo de Atención", event.tipoAtencion],
        ["Atención a la Emergencia", event.atencionEmergencia],
        ["Estado del Evento", event.estadoEvento],
        ["Fecha", new Date(event.fecha).toLocaleDateString()],
        ["Latitud", event.latitud],
        ["Longitud", event.longitud],
        ["URL", event.url],
      ],
      startY: 20, // Define el inicio de la tabla
      theme: "striped", // Tema de tabla (puede cambiarse a 'grid', 'plain', etc.)
      styles: { fontSize: 12 }, // Tamaño de la fuente en la tabla
      headStyles: { fillColor: [22, 160, 133] }, // Color del encabezado (opcional)
    });

    doc.save(`Evento_${event._id}.pdf`);
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[4.570868, -74.297333]} // Coordenadas iniciales (Bogotá, Colombia)
        zoom={zoom} // Utiliza el zoom recibido por props
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Componente que centra el mapa en las coordenadas */}
        <SetMapCenter lat={center.lat} lng={center.lng} zoom={zoom} />

        {filteredEvents.map((event) => (
          <Marker
            key={event._id}
            position={[event.latitud, event.longitud]}
            icon={createCustomIcon(20)}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setIcon(createCustomIcon(30)); // Aumentar el tamaño al pasar el mouse
              },
              mouseout: (e) => {
                e.target.setIcon(createCustomIcon(20)); // Volver al tamaño original
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-yellow-600">{event.evento}</h3>
                <p>
                  <strong>Causa:</strong> {event.causa}
                </p>
                <p>
                  <strong>Magnitud:</strong> {event.magnitud}
                </p>
                <p>
                  <strong>Ubicación:</strong> {event.ubicacionSector}
                </p>
                <p>
                  <strong>Afectaciones:</strong> {event.afectaciones}
                </p>
                <p>
                  {/* Mostrar la URL de la imagen o el texto "No hay imagen" si está vacío */}
                  <strong>Imagen:</strong>{" "}
                  {event.url ? (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Imagen
                    </a>
                  ) : (
                    "No hay imagen"
                  )}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(event.fecha).toLocaleDateString()}
                </p>

                {/* Botón para descargar el evento en PDF */}
                <button
                  onClick={() => handleDownloadPDF(event)}
                  className="bg-teal-500 text-white px-2 py-1 mt-2 mr-2 rounded hover:bg-teal-700"
                >
                  Descargar PDF
                </button>
                {/* Botón para eliminar el evento */}
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-red-500 text-white px-2 py-1 mt-2 rounded hover:bg-red-700"
                >
                  Eliminar Evento
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
