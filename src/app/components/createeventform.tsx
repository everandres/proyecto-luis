import { useState } from "react";
import { useEventContext } from "@/app/context/eventcontext";

export default function CreateEventForm({
  onEventCreated,
  closeForm,
}: {
  onEventCreated: (lat: number, lng: number) => void;
  closeForm: () => void;
}) {
  const { addEvent } = useEventContext();
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
    url: "", // Nueva propiedad opcional para la URL
  });
  const [errorMessage, setErrorMessage] = useState(""); // Estado para los errores
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar latitud y longitud
    const lat = parseFloat(formData.latitud);
    const lng = parseFloat(formData.longitud);

    // Validar campos obligatorios y seleccionables
    if (
      !formData.evento ||
      isNaN(lat) ||
      isNaN(lng) ||
      !formData.causa ||
      !formData.magnitud ||
      !formData.tipoManejo ||
      !formData.tipoAtencion
    ) {
      setErrorMessage(
        "Por favor, complete todos los campos obligatorios y seleccione opciones válidas."
      );
      return;
    }

    const newEvent = {
      evento: formData.evento || "",
      longitud: lng,
      latitud: lat,
      causa: formData.causa || "",
      ubicacionSector: formData.ubicacionSector || "",
      magnitud: formData.magnitud || "",
      afectaciones: formData.afectaciones || "",
      descripcionAfectacion: formData.descripcionAfectacion || "",
      tipoManejo: formData.tipoManejo || "",
      tipoAtencion: formData.tipoAtencion || "",
      atencionEmergencia: formData.atencionEmergencia || "",
      estadoEvento: formData.estadoEvento || "",
      fecha: formData.fecha ? new Date(formData.fecha) : "",
      url: formData.url || "", // Propiedad opcional URL
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

      // Añadir el nuevo evento al contexto
      addEvent(result);

      // Centrar el mapa en las coordenadas del nuevo evento
      onEventCreated(lat, lng);

      // Mostrar el mensaje de éxito
      setSuccessMessage("Evento creado con éxito");
      setErrorMessage(""); // Limpiar cualquier error previo

      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        setSuccessMessage(""); // Limpiar el mensaje de éxito
        closeForm(); // Cerrar el formulario
      }, 2000);
    } catch (error) {
      console.error("Error al crear evento:", error);
      setErrorMessage("Error al crear el evento, intente de nuevo.");
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
      <button
        type="button"
        onClick={closeForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        aria-label="Cerrar formulario"
      >
        ✖
      </button>
      {/* Mostrar mensaje de error si lo hay */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Mostrar mensaje de éxito si lo hay */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Campo obligatorio: Evento */}
      <div>
        <label
          htmlFor="evento"
          className="block text-sm text-teal-950 font-semibold"
        >
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
        <label
          htmlFor="latitud"
          className="block text-sm text-teal-950 font-semibold"
        >
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
        <label
          htmlFor="longitud"
          className="block text-sm text-teal-950 font-semibold"
        >
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

      {/* Campo obligatorio: Causa (select) */}
      <div>
        <label
          htmlFor="causa"
          className="block text-sm text-teal-950 font-semibold"
        >
          Causa
        </label>
        <select
          name="causa"
          id="causa"
          value={formData.causa}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="">Seleccione una causa</option>
          <option value="ACCIDENTE">ACCIDENTE</option>
          <option value="ACCIDENTE AÉREO">ACCIDENTE AÉREO</option>
          <option value="ACCIDENTE DE TRANSITO">ACCIDENTE DE TRANSITO</option>
          <option value="ACCIDENTE FLUVIAL">ACCIDENTE FLUVIAL</option>
          <option value="ACCIDENTE MARITIMO">ACCIDENTE MARITIMO</option>
          <option value="ACCIDENTE MINERO">ACCIDENTE MINERO</option>
          <option value="AVALANCHA">AVALANCHA</option>
          <option value="AVENIDA TORRENCIAL">AVENIDA TORRENCIAL</option>
          <option value="COLAPSO">COLAPSO</option>
          <option value="CONTAMINACION">CONTAMINACION</option>
          <option value="CRECIENTE SUBITA">CRECIENTE SUBITA</option>
          <option value="DESLIZAMIENTO">DESLIZAMIENTO</option>
          <option value="DESABASTECIMIENTO DE AGUA">
            DESABASTECIMIENTO DE AGUA
          </option>
          <option value="EROSION">EROSION</option>
          <option value="ERUPCION">ERUPCION</option>
          <option value="ERUPCION VOLCANICA">ERUPCION VOLCANICA</option>
          <option value="EXPLOSION">EXPLOSION</option>
          <option value="FALLA GEOLOGICA">FALLA GEOLOGICA</option>
          <option value="GRANIZADA">GRANIZADA</option>
          <option value="HELADA">HELADA</option>
          <option value="INCENDIO">INCENDIO</option>
          <option value="INCENDIO ESTRUCTURAL">INCENDIO ESTRUCTURAL</option>
          <option value="INCENDIO FORESTAL">INCENDIO FORESTAL</option>
          <option value="INCENDIO VEHICULAR">INCENDIO VEHICULAR</option>
          <option value="INUNDACION">INUNDACION</option>
          <option value="MAREJADA">MAREJADA</option>
          <option value="MOVIMIENTO EN MASA">MOVIMIENTO EN MASA</option>
          <option value="OTROS">OTROS</option>
          <option value="REMOCION EN MASA">REMOCION EN MASA</option>
          <option value="REPRESAMIENTO">REPRESAMIENTO</option>
          <option value="SISMO">SISMO</option>
          <option value="TORMENTA ELECTRICA">TORMENTA ELECTRICA</option>
          <option value="VENDAVAL">VENDAVAL</option>
        </select>
      </div>

      {/* Campo opcional: Ubicación Sector */}
      <div>
        <label
          htmlFor="ubicacionSector"
          className="block text-sm text-teal-950 font-semibold"
        >
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

      {/* Campo obligatorio: Magnitud (select) */}
      <div>
        <label
          htmlFor="magnitud"
          className="block text-sm text-teal-950 font-semibold"
        >
          Magnitud
        </label>
        <select
          name="magnitud"
          id="magnitud"
          value={formData.magnitud}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
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
        <label
          htmlFor="afectaciones"
          className="block text-sm text-teal-950 font-semibold"
        >
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
          className="block text-sm text-teal-950 font-semibold"
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

      {/* Campo obligatorio: Tipo de Manejo (select) */}
      <div>
        <label
          htmlFor="tipoManejo"
          className="block text-sm text-teal-950 font-semibold"
        >
          Tipo de Manejo
        </label>
        <select
          name="tipoManejo"
          id="tipoManejo"
          value={formData.tipoManejo}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="">Seleccione el tipo de manejo</option>
          <option value="Local">Local - Distrital</option>
          <option value="Departamental">Departamental</option>
          <option value="Nacional">Nacional</option>
          <option value="Internacional">Internacional</option>
          <option value="Privado">Privado</option>
        </select>
      </div>

      {/* Campo obligatorio: Tipo de Atención (select) */}
      <div>
        <label
          htmlFor="tipoAtencion"
          className="block text-sm text-teal-950 font-semibold"
        >
          Tipo de Atención
        </label>
        <select
          name="tipoAtencion"
          id="tipoAtencion"
          value={formData.tipoAtencion}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
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
          className="block text-sm text-teal-950 font-semibold"
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
        <label
          htmlFor="estadoEvento"
          className="block text-sm text-teal-950 font-semibold"
        >
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

      <div>
        <label
          htmlFor="url"
          className="block text-sm text-teal-950 font-semibold"
        >
          URL de la imagen (opcional)
        </label>
        <input
          type="text"
          name="url"
          id="url"
          value={formData.url}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Campo opcional: Fecha del evento */}
      <div>
        <label
          htmlFor="fecha"
          className="block text-sm text-teal-950 font-semibold"
        >
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

      {/* Botón para crear evento */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Crear Evento
      </button>
    </form>
  );
}
