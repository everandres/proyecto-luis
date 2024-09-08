"use client"; // Habilitar modo cliente para usar hooks y estados

import dynamic from "next/dynamic";
import { useState } from "react";
import { useEventContext } from "@/app/context/eventcontext";
import Navbar from "../components/navbar";

// Cargar dinámicamente el componente del mapa
const EventMap = dynamic(() => import("@/app/components/eventmap"), {
  ssr: false,
});

const Page: React.FC = () => {
  const { events, loading, error } = useEventContext(); // Obtener los eventos del contexto
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 4.60971, // Coordenadas iniciales de Bogotá
    lng: -74.083252,
  });
  const [mapZoom, setMapZoom] = useState<number>(2); // Establecemos el zoom inicial en 5

  // Función para centrar el mapa cuando se crea un nuevo evento
  const handleEventCreated = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setMapZoom(13); // Cambia el zoom cuando se centra en un nuevo evento
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Navbar con z-index alto para que esté sobre el mapa */}
      <div className="relative z-50">
        <Navbar onEventCreated={handleEventCreated} />{" "}
        {/* Pasamos la función */}
      </div>

      {loading ? (
        <p className="absolute z-40">Cargando eventos...</p>
      ) : error ? (
        <p className="absolute z-40">Error al cargar los eventos: {error}</p>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {/* Pasamos las coordenadas al mapa */}
          <EventMap center={mapCenter} />
        </div>
      )}
    </div>
  );
};

export default Page;
