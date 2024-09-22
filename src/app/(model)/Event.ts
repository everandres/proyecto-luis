import mongoose, { Model, Schema } from "mongoose";
import { IEvent } from "./IEvent";

const EventSchema = new mongoose.Schema({
  evento: { type: String, required: true },
  longitud: { type: Number, required: true },
  latitud: { type: Number, required: true },
  causa: { type: String, required: true },
  ubicacionSector: { type: String, required: true },
  magnitud: { type: String, required: true },
  afectaciones: { type: String, required: true },
  descripcionAfectacion: { type: String, required: true },
  tipoManejo: { type: String, required: true },
  tipoAtencion: { type: String, required: true },
  atencionEmergencia: { type: String, required: true },
  estadoEvento: { type: String, required: true },
  fecha: { type: Date, required: true }, // Campo 'fecha' requerido y de tipo Date
  url: { type: String, required: false }, // Nueva llave 'url' de tipo String
});

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
