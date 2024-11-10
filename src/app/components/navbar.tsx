import { useState } from "react";
import CreateEventForm from "@/app/components/createeventform"; // Importar el formulario
import FilterEvents from "@/app/components/filtrareventos"; // Importar el componente de filtro
import DownloadCSVButton from "@/app/components/downloadbutton"; // Importar el botón de descarga de CSV

export default function Navbar({
  onEventCreated,
  onFilter,
  onRestoreFilter,
  startDate,
  endDate,
}: {
  onEventCreated: (lat: number, lng: number) => void;
  onFilter: (startDate: Date, endDate: Date) => void;
  onRestoreFilter: () => void;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    if (!dropdownOpen) {
      setFilterDropdownOpen(false); // Cierra el filtro si está abierto
    }
    setDropdownOpen(!dropdownOpen);
  };

  const toggleFilterDropdown = () => {
    if (!filterDropdownOpen) {
      setDropdownOpen(false); // Cierra el formulario si está abierto
    }
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeForm = () => {
    setDropdownOpen(false);
  };

  const closeFilterDropdown = () => {
    setFilterDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-700 p-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center space-x-3">
          <h1 className="text-white text-lg font-semibold">
            Mapa Interactivo de Eventos de Emergencias en Santa Marta
          </h1>
        </div>

        {/* Icono de menú para pantallas pequeñas */}
        <button
          onClick={toggleMenu}
          className="text-teal-100 sm:hidden focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menú de navegación, se muestra como flex solo en pantallas grandes */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } sm:flex sm:items-center mt-4 sm:mt-0`}
      >
        {/* Botón de Crear Evento */}
        <button
          className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition mr-2"
          onClick={toggleDropdown}
        >
          {dropdownOpen ? "Cerrar formulario" : "Crear Evento"}
        </button>

        {/* Dropdown con el formulario */}
        {dropdownOpen && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-11/12 max-w-md max-h-[80vh] overflow-y-auto bg-white p-4 rounded-xl shadow-2xl border border-gray-200 z-50">
            <CreateEventForm
              onEventCreated={onEventCreated}
              closeForm={closeForm}
            />
          </div>
        )}

        {/* Botón de Filtrar Eventos */}
        <button
          className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-yellow-900 transition mr-2"
          onClick={toggleFilterDropdown}
        >
          {filterDropdownOpen ? "Cerrar filtro" : "Filtrar Eventos"}
        </button>

        {/* Dropdown para el filtro */}
        {filterDropdownOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
            <div className="relative w-11/12 max-w-md h-1/2 bg-white p-6 rounded-md shadow-lg overflow-y-auto">
              <FilterEvents
                onFilter={onFilter}
                onRestoreFilter={onRestoreFilter}
                closeFilter={closeFilterDropdown} // Pasa la función para cerrar
              />
            </div>
          </div>
        )}

        {/* Botón para descargar CSV */}
        <div className="mt-2 sm:mt-0">
          <DownloadCSVButton startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </nav>
  );
}
