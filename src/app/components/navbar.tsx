import { useState } from "react";
import CreateEventForm from "@/app/components/createeventform"; // Importar el formulario

export default function Navbar({
  onEventCreated,
}: {
  onEventCreated: (lat: number, lng: number) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Cambiar estado para abrir/cerrar el dropdown
  };

  // Función para cerrar el formulario
  const closeForm = () => {
    setDropdownOpen(false); // Cambia el estado para cerrar el dropdown
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold">Mapa de Eventos</h1>
      <div className="relative">
        {/* Botón del dropdown */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={toggleDropdown}
        >
          {dropdownOpen ? "Cerrar formulario" : "Crear Evento"}
        </button>

        {/* Dropdown con el formulario */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-96 max-h-[80vh] overflow-y-auto bg-white p-4 rounded-md shadow-lg z-50">
            {/* Pasamos la función `onEventCreated` y `closeForm` al formulario */}
            <CreateEventForm
              onEventCreated={onEventCreated}
              closeForm={closeForm} // Pasamos la función para cerrar el formulario
            />
          </div>
        )}
      </div>
    </nav>
  );
}
