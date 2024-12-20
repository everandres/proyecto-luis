import mongoose from "mongoose";

// Aquí extendemos el tipo global de Node.js para incluir la propiedad mongoose
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

declare module "*.geojson" {
  const value: any;
  export default value;
}

// Exportar el archivo para que TypeScript lo considere un módulo
export {};
