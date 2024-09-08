import { useState } from "react";
import { useEventContext } from "@/app/context/eventcontext"; // Asegúrate de importar el contexto

export default function CreateEventForm({
  onEventCreated,
  closeForm,
}: {
  onEventCreated: (lat: number, lng: number) => void;
  closeForm: () => void; // Función para cerrar el formulario
}) {
  const { addEvent } = useEventContext(); // Usar el contexto para agregar un nuevo evento
  const [formData, setFormData] = useState({
    evento: "",
    longitud: "",
    latitud: "",
    causa: "",
    ubicacionSector: "",
    magnitud: "",
    afectaciones: "",
    descripcionAfectacion: "",
    tipoManejo: "",
    tipoAtencion: "",
    atencionEmergencia: "",
    estadoEvento: "",
    fecha: "",
  });
  const [message, setMessage] = useState(""); // Estado para mostrar el mensaje de éxito

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEvent = {
      ...formData,
      longitud: parseFloat(formData.longitud),
      latitud: parseFloat(formData.latitud),
      fecha: formData.fecha ? new Date(formData.fecha) : "",
    };

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      const result = await response.json();
      console.log("Evento creado:", result);

      // Añadimos el evento recién creado al contexto
      addEvent(result);

      // Llamamos a la función para centrar el mapa en las coordenadas del nuevo evento
      onEventCreated(
        parseFloat(formData.latitud),
        parseFloat(formData.longitud)
      );

      // Mostrar el mensaje de éxito y cerrar el formulario después de 2 segundos
      setMessage("Evento creado con éxito");
      setTimeout(() => {
        setMessage(""); // Limpiar el mensaje
        closeForm(); // Cerrar el formulario
      }, 2000);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 w-full">
      {/* Campo obligatorio: Evento */}
      <div>
        <label htmlFor="evento" className="block text-sm font-medium">
          Evento
        </label>
        <input
          type="text"
          name="evento"
          id="evento"
          value={formData.evento}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {/* Campo obligatorio: Latitud */}
      <div>
        <label htmlFor="latitud" className="block text-sm font-medium">
          Latitud
        </label>
        <input
          type="text"
          name="latitud"
          id="latitud"
          value={formData.latitud}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {/* Campo obligatorio: Longitud */}
      <div>
        <label htmlFor="longitud" className="block text-sm font-medium">
          Longitud
        </label>
        <input
          type="text"
          name="longitud"
          id="longitud"
          value={formData.longitud}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {/* Campo opcional: Causa (select) */}
      <div>
        <label htmlFor="causa" className="block text-sm font-medium">
          Causa
        </label>
        <select
          name="causa"
          id="causa"
          value={formData.causa}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Seleccione una causa</option>
          <option value="Lluvias intensas">Lluvias intensas</option>
          <option value="Deslizamiento de tierra">
            Deslizamiento de tierra
          </option>
          <option value="Fracturación de rocas">Fracturación de rocas</option>
          <option value="Inundación">Inundación</option>
          <option value="Falla estructural">Falla estructural</option>
          <option value="Incendio forestal">Incendio forestal</option>
          <option value="Actividad sísmica">Actividad sísmica</option>
        </select>
      </div>

      {/* Campo opcional: Ubicación Sector */}
      <div>
        <label htmlFor="ubicacionSector" className="block text-sm font-medium">
          Ubicación Sector
        </label>
        <input
          type="text"
          name="ubicacionSector"
          id="ubicacionSector"
          value={formData.ubicacionSector}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Magnitud (select) */}
      <div>
        <label htmlFor="magnitud" className="block text-sm font-medium">
          Magnitud
        </label>
        <select
          name="magnitud"
          id="magnitud"
          value={formData.magnitud}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Seleccione la magnitud</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Crítica">Crítica</option>
        </select>
      </div>

      {/* Campo opcional: Afectaciones */}
      <div>
        <label htmlFor="afectaciones" className="block text-sm font-medium">
          Afectaciones
        </label>
        <input
          type="text"
          name="afectaciones"
          id="afectaciones"
          value={formData.afectaciones}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Descripción de la Afectación */}
      <div>
        <label
          htmlFor="descripcionAfectacion"
          className="block text-sm font-medium"
        >
          Descripción de la Afectación
        </label>
        <input
          type="text"
          name="descripcionAfectacion"
          id="descripcionAfectacion"
          value={formData.descripcionAfectacion}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Tipo de Manejo (select) */}
      <div>
        <label htmlFor="tipoManejo" className="block text-sm font-medium">
          Tipo de Manejo
        </label>
        <select
          name="tipoManejo"
          id="tipoManejo"
          value={formData.tipoManejo}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Seleccione el tipo de manejo</option>
          <option value="Local">Local</option>
          <option value="Distrital">Distrital</option>
          <option value="Nacional">Nacional</option>
          <option value="Internacional">Internacional</option>
          <option value="Privado">Privado</option>
        </select>
      </div>

      {/* Campo opcional: Tipo de Atención (select) */}
      <div>
        <label htmlFor="tipoAtencion" className="block text-sm font-medium">
          Tipo de Atención
        </label>
        <select
          name="tipoAtencion"
          id="tipoAtencion"
          value={formData.tipoAtencion}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Seleccione el tipo de atención</option>
          <option value="Emergencia">Emergencia</option>
          <option value="Rescate">Rescate</option>
          <option value="Evacuación">Evacuación</option>
          <option value="Prevención">Prevención</option>
          <option value="Rehabilitación">Rehabilitación</option>
          <option value="Mitigación">Mitigación</option>
        </select>
      </div>

      {/* Campo opcional: Atención a la Emergencia */}
      <div>
        <label
          htmlFor="atencionEmergencia"
          className="block text-sm font-medium"
        >
          Atención a la Emergencia
        </label>
        <input
          type="text"
          name="atencionEmergencia"
          id="atencionEmergencia"
          value={formData.atencionEmergencia}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Estado del Evento */}
      <div>
        <label htmlFor="estadoEvento" className="block text-sm font-medium">
          Estado del Evento
        </label>
        <input
          type="text"
          name="estadoEvento"
          id="estadoEvento"
          value={formData.estadoEvento}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Fecha del evento */}
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium">
          Fecha del evento
        </label>
        <input
          type="date"
          name="fecha"
          id="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Crear Evento
      </button>
    </form>
  );
}
