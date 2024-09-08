import { Document } from "mongoose";

export interface IEvent extends Document {
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
