import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importar los estilos del calendario

interface FilterEventsProps {
  onFilter: (startDate: Date, endDate: Date) => void;
  onRestoreFilter: () => void;
}

export default function FilterEvents({
  onFilter,
  onRestoreFilter,
}: FilterEventsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onFilter(startDate, endDate); // Llamamos a onFilter con las fechas seleccionadas
    }
  };

  const handleRestoreFilter = () => {
    setStartDate(undefined); // Limpiar la fecha de inicio
    setEndDate(undefined); // Limpiar la fecha de fin
    onRestoreFilter(); // Llamar a la función externa para restaurar los eventos
  };

  return (
    <form onSubmit={handleFilterSubmit} className="space-y-4">
      <div className="w-full">
        <label className="block text-sm font-medium">
          Seleccionar Rango de Fechas
        </label>
        <div className="flex flex-col space-y-4">
          {/* Calendario para seleccionar la fecha de inicio */}
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date || undefined)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Fecha inicio"
            className="mt-1 block w-full min-w-[200px] border-gray-300 rounded-md shadow-sm"
            dateFormat="yyyy-MM-dd"
          />
          {/* Calendario para seleccionar la fecha de fin */}
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date || undefined)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Fecha fin"
            className="mt-1 block w-full min-w-[200px] border-gray-300 rounded-md shadow-sm"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Filtrar Eventos
      </button>

      <button
        type="button"
        onClick={handleRestoreFilter} // Llamar a la función que también limpia las fechas
        className="bg-red-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-red-700 transition"
      >
        Restaurar Eventos
      </button>
    </form>
  );
}
