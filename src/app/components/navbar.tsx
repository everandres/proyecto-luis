import { useState } from "react";
import CreateEventForm from "@/app/components/createeventform"; // Importar el formulario
import FilterEvents from "@/app/components/filtrareventos"; // Importar el componente de filtro
import DownloadCSVButton from "@/app/components/downloadbutton"; // Importar el botón de descarga de CSV

export default function Navbar({
  onEventCreated,
  onFilter,
  onRestoreFilter,
  startDate, // Añadimos startDate
  endDate, // Añadimos endDate
}: {
  onEventCreated: (lat: number, lng: number) => void;
  onFilter: (startDate: Date, endDate: Date) => void;
  onRestoreFilter: () => void;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Cambiar estado para abrir/cerrar el dropdown
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen); // Cambiar estado para abrir/cerrar el dropdown de filtro
  };

  // Función para cerrar el formulario
  const closeForm = () => {
    setDropdownOpen(false); // Cambia el estado para cerrar el dropdown
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold">Mapa de Eventos</h1>
      <div className="relative">
        {/* Botón del dropdown de Crear Evento */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={toggleDropdown}
        >
          {dropdownOpen ? "Cerrar formulario" : "Crear Evento"}
        </button>

        {/* Dropdown con el formulario */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-96 max-h-[80vh] overflow-y-auto bg-white p-4 rounded-md shadow-lg z-50">
            <CreateEventForm
              onEventCreated={onEventCreated}
              closeForm={closeForm}
            />
          </div>
        )}

        {/* Botón del dropdown de Filtrar Eventos */}
        <button
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={toggleFilterDropdown}
        >
          {filterDropdownOpen ? "Cerrar filtro" : "Filtrar Eventos"}
        </button>

        {/* Dropdown para aplicar filtros */}
        {filterDropdownOpen && (
          <div className="absolute right-0 mt-2 w-full min-w-[400px] max-w-md max-h-[80vh] overflow-y-auto bg-white p-6 rounded-md shadow-lg z-50">
            <FilterEvents
              onFilter={onFilter}
              onRestoreFilter={onRestoreFilter}
            />
          </div>
        )}

        {/* Botón para descargar información en CSV */}
        <DownloadCSVButton startDate={startDate} endDate={endDate} />
      </div>
    </nav>
  );
}
