import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEventContext } from "@/app/context/eventcontext"; // Importar el hook para acceder al contexto
import L from "leaflet";

// Crear ícono personalizado para los marcadores
const createCustomIcon = (size: number) =>
  L.divIcon({
    className:
      "bg-red-500 rounded-full border-4 border-red-200 hover:bg-green-500 hover:border-green-200 transition-all duration-300 ease-in-out",
    iconSize: [size, size], // Ajustar el tamaño del icono
  });

// Componente para centrar el mapa
function SetMapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 13); // Centramos el mapa en las coordenadas dadas con zoom 13
    }
  }, [lat, lng, map]);

  return null; // Este componente no necesita renderizar nada
}

export default function EventMap({
  center,
}: {
  center: { lat: number; lng: number };
}) {
  const { events, loading, error } = useEventContext();

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[4.570868, -74.297333]} // Coordenadas iniciales (Bogotá, Colombia)
        zoom={2}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Componente que centra el mapa en las coordenadas */}
        <SetMapCenter lat={center.lat} lng={center.lng} />

        {events.map((event) => (
          <Marker
            key={event._id}
            position={[event.latitud, event.longitud]}
            icon={createCustomIcon(20)} // Tamaño inicial
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
                <h3 className="font-bold">{event.evento}</h3>
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
                  <strong>Fecha:</strong>{" "}
                  {new Date(event.fecha).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
