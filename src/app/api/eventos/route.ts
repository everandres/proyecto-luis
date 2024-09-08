import { NextResponse } from "next/server";
import connectMongo from "@/app/(lib)/mongodb";
import Event from "@/app/(model)/Event";

// Manejar el método GET (Obtener todos los eventos)
export async function GET() {
  try {
    await connectMongo(); // Conectar a MongoDB dentro de la función GET
    const events = await Event.find(); // Obtener todos los eventos
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Manejar el método POST (Crear uno o varios eventos)
export async function POST(req: Request) {
  try {
    await connectMongo(); // Conectar a MongoDB dentro de la función POST
    const body = await req.json(); // Parsear el cuerpo de la solicitud

    // Verificar si es un arreglo o un solo objeto
    if (Array.isArray(body)) {
      // Insertar varios eventos a la vez
      const events = await Event.insertMany(body);
      return NextResponse.json(events, { status: 201 });
    } else {
      // Insertar un solo evento
      const event = new Event(body);
      await event.save();
      return NextResponse.json(event, { status: 201 });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
