import { useEventContext, Event } from "@/app/context/eventcontext"; // Importar el contexto y el tipo Event

interface DownloadCSVButtonProps {
  startDate: Date | null; // Pasar la fecha de inicio como prop
  endDate: Date | null; // Pasar la fecha de fin como prop
}

export default function DownloadCSVButton({
  startDate,
  endDate,
}: DownloadCSVButtonProps) {
  const { events } = useEventContext(); // Obtener los eventos del contexto

  // Filtrar eventos por rango de fechas, igual que en EventMap
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.fecha);
    if (startDate && endDate) {
      return eventDate >= startDate && eventDate <= endDate;
    }
    return true; // Si no hay fechas, devolver todos los eventos
  });

  const handleDownloadCSV = () => {
    if (filteredEvents.length === 0) {
      alert("No hay eventos para descargar");
      return;
    }

    // Crear el contenido del CSV
    const csvContent = [
      [
        "ID",
        "Evento",
        "Causa",
        "Latitud",
        "Longitud",
        "Ubicación Sector",
        "Magnitud",
        "Afectaciones",
        "Descripción Afectación",
        "Tipo Manejo",
        "Tipo Atención",
        "Atención Emergencia",
        "Estado Evento",
        "Fecha",
      ],
      ...filteredEvents.map((event) => [
        event._id,
        event.evento,
        event.causa,
        event.latitud,
        event.longitud,
        event.ubicacionSector,
        event.magnitud,
        event.afectaciones,
        event.descripcionAfectacion,
        event.tipoManejo,
        event.tipoAtencion,
        event.atencionEmergencia,
        event.estadoEvento,
        new Date(event.fecha).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(",")) // Convertir cada fila en una cadena CSV
      .join("\n"); // Unir todas las filas con un salto de línea

    // Crear un blob con el contenido CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "eventos_filtrados.csv"); // Nombre del archivo
    document.body.appendChild(link);
    link.click(); // Simular el clic para iniciar la descarga
    document.body.removeChild(link); // Eliminar el enlace después de la descarga
  };

  return (
    <button
      type="button"
      onClick={handleDownloadCSV} // Función para descargar el archivo CSV
      className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-blue-700 transition"
    >
      Descargar Información CSV
    </button>
  );
}
