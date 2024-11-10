import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEventContext } from "@/app/context/eventcontext";
import { Event } from "@/app/context/eventcontext";
import L from "leaflet";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const createCustomIcon = (size: number) =>
  L.divIcon({
    className:
      "bg-red-500 rounded-full border-4 border-red-200 hover:bg-green-500 hover:border-green-200 transition-all duration-300 ease-in-out",
    iconSize: [size, size],
  });

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
      map.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom, map]);

  return null;
}

function ShowCoordinates() {
  const map = useMap();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      setCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    };

    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("mousemove", handleMouseMove);
    };
  }, [map]);

  return (
    coords && (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "5px",
          borderRadius: "5px",
          zIndex: 1000,
        }}
      >
        Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
      </div>
    )
  );
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
  const { events, loading, error, removeEvent } = useEventContext();

  const [selectedTileMap, setSelectedTileMap] = useState(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  );

  // Estados para almacenar los datos GeoJSON y controlar visibilidad
  const [localidadesData, setLocalidadesData] = useState(null);
  const [limiteMunicipalData, setLimiteMunicipalData] = useState(null);
  const [barriosData, setBarriosData] = useState(null);
  const [showBarrios, setShowBarrios] = useState(false);
  const [showLocalidades, setShowLocalidades] = useState(false);
  const [showLimiteMunicipal, setShowLimiteMunicipal] = useState(true);

  // Cargar los datos de GeoJSON desde la carpeta pública
  useEffect(() => {
    fetch("/localidades.geojson")
      .then((response) => response.json())
      .then((data) => setLocalidadesData(data))
      .catch((error) =>
        console.error("Error loading localidades GeoJSON:", error)
      );

    fetch("/limite_municipal.geojson")
      .then((response) => response.json())
      .then((data) => setLimiteMunicipalData(data))
      .catch((error) =>
        console.error("Error loading limite_municipal GeoJSON:", error)
      );

    fetch("/barrios.geojson")
      .then((response) => response.json())
      .then((data) => setBarriosData(data))
      .catch((error) => console.error("Error loading barrios GeoJSON:", error));
  }, []);

  const tileMaps = {
    "OpenStreetMap Streets":
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "Esri Satellite":
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    "Esri Topographic":
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    "CartoDB Positron":
      "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    "CartoDB Dark Matter":
      "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.fecha);
    if (startDate && endDate) {
      return eventDate >= startDate && eventDate <= endDate;
    }
    return true;
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

  const handleDownloadPDF = (event: Event) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Detalles del Evento", 10, 10);

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
        ["URL", event.url ?? "No disponible"],
      ],
      startY: 20,
      theme: "striped",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`Evento_${event._id}.pdf`);
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen w-full relative">
      {/* Selector de Mapa Base */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none z-[1000] bg-white p-3 sm:rounded shadow-lg w-11/12 sm:w-auto max-w-sm">
        <label className="text-sm font-semibold">Seleccionar Mapa Base:</label>
        <select
          className="mt-1 p-2 border rounded w-full"
          value={selectedTileMap}
          onChange={(e) => setSelectedTileMap(e.target.value)}
        >
          {Object.entries(tileMaps).map(([name, url]) => (
            <option key={name} value={url}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Controles para activar/desactivar capas */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none z-[1000] bg-white p-3 sm:rounded shadow-lg w-11/12 sm:w-auto max-w-sm">
        <label className="text-sm font-semibold mb-2">Capas GeoJSON:</label>
        <div className="flex flex-col">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showLocalidades}
              onChange={() => setShowLocalidades(!showLocalidades)}
            />
            <span>Localidades</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={showLimiteMunicipal}
              onChange={() => setShowLimiteMunicipal(!showLimiteMunicipal)}
            />
            <span>Límite Municipal</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={showBarrios}
              onChange={() => setShowBarrios(!showBarrios)}
            />
            <span>Barrios</span>
          </label>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer url={selectedTileMap} />

        <SetMapCenter lat={center.lat} lng={center.lng} zoom={zoom} />
        <ShowCoordinates />

        {/* Agregar las capas GeoJSON condicionalmente */}
        {showLocalidades && localidadesData && (
          <GeoJSON
            data={localidadesData}
            style={{ color: "blue", weight: 1.2, fillColor: "transparent" }}
          />
        )}
        {showLimiteMunicipal && limiteMunicipalData && (
          <GeoJSON
            data={limiteMunicipalData}
            style={{ color: "red", weight: 2, fillColor: "transparent" }}
          />
        )}
        {showBarrios && barriosData && (
          <GeoJSON
            data={barriosData}
            style={{ color: "green", weight: 1.5, fillColor: "transparent" }}
          />
        )}

        {filteredEvents.map((event) => (
          <Marker
            key={event._id}
            position={[event.latitud, event.longitud]}
            icon={createCustomIcon(20)}
            eventHandlers={{
              mouseover: (e) => e.target.setIcon(createCustomIcon(30)),
              mouseout: (e) => e.target.setIcon(createCustomIcon(20)),
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
                <button
                  onClick={() => handleDownloadPDF(event)}
                  className="bg-teal-500 text-white px-2 py-1 mt-2 mr-2 rounded hover:bg-teal-700"
                >
                  Descargar PDF
                </button>
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
