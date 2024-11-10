import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

interface FilterEventsProps {
  onFilter: (startDate: Date, endDate: Date) => void;
  onRestoreFilter: () => void;
  closeFilter?: () => void;
}

export default function FilterEvents({
  onFilter,
  onRestoreFilter,
  closeFilter,
}: FilterEventsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onFilter(startDate, endDate);
    }
  };

  const handleRestoreFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onRestoreFilter();
  };

  return (
    <form onSubmit={handleFilterSubmit} className="relative space-y-4 p-4 z-50">
      <button
        type="button"
        onClick={closeFilter}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        aria-label="Cerrar filtro"
      >
        ✖
      </button>

      <div className="w-full">
        <label className="block text-sm text-teal-950 font-semibold">
          Seleccionar Rango de Fechas
        </label>
        <div className="flex flex-col space-y-4">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date || undefined)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Fecha inicio"
            className="mt-1 block w-full h-full min-w-[200px] border-gray-300 rounded-md shadow-sm"
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom-start"
          />
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
            popperPlacement="bottom-start"
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
        onClick={handleRestoreFilter}
        className="bg-red-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-red-700 transition"
      >
        Restaurar Eventos
      </button>
    </form>
  );
}
