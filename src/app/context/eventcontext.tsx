"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Definir el tipo de los eventos
interface Event {
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
  fecha: Date;
}

// Definir el tipo de contexto
interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (newEvent: Event) => void; // Función para agregar eventos
}

// Crear el contexto
const EventContext = createContext<EventContextType | undefined>(undefined);

// Crear un hook para usar el contexto
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener los eventos desde la API
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/eventos");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError("Error al obtener eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Función para agregar un nuevo evento al estado
  const addEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <EventContext.Provider value={{ events, loading, error, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
