"use client"; // Habilitar modo cliente para usar hooks y estados

import dynamic from "next/dynamic";
import { useState } from "react";
import { useEventContext } from "@/app/context/eventcontext";
import Navbar from "../components/navbar";
import SuccessCard from "@/app/components/succescard"; // Importar la tarjeta de éxito

// Cargar dinámicamente el componente del mapa
const EventMap = dynamic(() => import("@/app/components/eventmap"), {
  ssr: false,
});

const Page: React.FC = () => {
  const { loading, error, resetFilters } = useEventContext(); // Asegúrate de usar resetFilters del contexto
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 11.23611, // Coordenadas iniciales de Santa Marta
    lng: -74.2016,
  });
  const [mapZoom, setMapZoom] = useState<number>(12); // Establecemos el zoom inicial en 6
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const [startDate, setStartDate] = useState<Date | null>(null); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState<Date | null>(null); // Estado para la fecha de fin

  // Función para centrar el mapa cuando se crea un nuevo evento
  const handleEventCreated = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setMapZoom(13); // Cambia el zoom cuando se centra en un nuevo evento
    setSuccessMessage("Evento creado con éxito"); // Mostrar el mensaje de éxito

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Función para filtrar eventos por rango de fechas
  const handleFilter = (start: Date, end: Date) => {
    console.log(`Filtrando eventos desde ${start} hasta ${end}`);
    setStartDate(start); // Establecer la fecha de inicio
    setEndDate(end); // Establecer la fecha de fin
  };

  // Función para restaurar los filtros y mostrar todos los eventos
  const handleRestoreFilter = () => {
    resetFilters(); // Llamar a la función para restaurar los filtros en el contexto
    setStartDate(null); // Restablecer el estado de la fecha de inicio
    setEndDate(null); // Restablecer el estado de la fecha de fin
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Navbar con z-index alto para que esté sobre el mapa */}
      <div className="relative z-50">
        <Navbar
          onEventCreated={handleEventCreated}
          onFilter={handleFilter}
          onRestoreFilter={handleRestoreFilter}
          startDate={startDate} // Pasar la fecha de inicio al Navbar
          endDate={endDate} // Pasar la fecha de fin al Navbar
        />
      </div>

      {/* Mostrar la tarjeta de éxito si existe un mensaje */}
      {successMessage && <SuccessCard message={successMessage} />}

      {loading ? (
        <p className="absolute z-40">Cargando eventos...</p>
      ) : error ? (
        <p className="absolute z-40">Error al cargar los eventos: {error}</p>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {/* Pasamos las coordenadas al mapa */}
          <EventMap
            center={mapCenter}
            zoom={mapZoom}
            startDate={startDate} // Pasamos la fecha de inicio
            endDate={endDate} // Pasamos la fecha de fin
          />
        </div>
      )}
    </div>
  );
};

export default Page;
