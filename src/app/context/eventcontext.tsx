"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Definir el tipo de los eventos
export interface Event {
  _id: string;
  evento: string;
  longitud: number;
  latitud: number;
  causa: string;
  ubicacionSector: string;
  magnitud: string;
  afectaciones: string;
  descripcionAfectacion: string;
  tipoManejo: string;
  tipoAtencion: string;
  atencionEmergencia: string;
  estadoEvento: string;
  url?: string;
  fecha: Date;
}

// Definir el tipo de contexto
interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (newEvent: Event) => void;
  removeEvent: (eventId: string) => void;
  filterEventsByDate: (startDate: Date | null, endDate: Date | null) => void; // Modificamos la firma para manejar rangos de fechas
  resetFilters: () => void;
}

// Crear el contexto
const EventContext = createContext<EventContextType | undefined>(undefined);

// Hook para usar el contexto
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext debe usarse dentro de un EventProvider");
  }
  return context;
};

// Proveedor de contexto para los eventos
export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener los eventos desde la API
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/eventos");
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data); // Inicialmente mostrar todos los eventos
      } catch (error) {
        setError("Error al obtener eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Función para agregar un nuevo evento
  const addEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setFilteredEvents((prevEvents) => [...prevEvents, newEvent]); // Agregarlo a los eventos filtrados también
  };

  // Función para eliminar un evento
  const removeEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== eventId)
    );
    setFilteredEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== eventId)
    );
  };

  // Función para filtrar eventos por rango de fechas
  const filterEventsByDate = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) {
      setFilteredEvents(events); // Si no hay fechas, mostrar todos los eventos
      return;
    }

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.fecha);
      return eventDate >= startDate && eventDate <= endDate;
    });

    setFilteredEvents(filtered);
  };

  // Función para restablecer los filtros y mostrar todos los eventos
  const resetFilters = () => {
    setFilteredEvents(events); // Restablecemos filteredEvents a todos los eventos
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents, // Usamos filteredEvents
        loading,
        error,
        addEvent,
        removeEvent,
        filterEventsByDate, // Función para aplicar filtro
        resetFilters, // Función para restablecer los filtros
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
