import { NextResponse } from "next/server";
import connectMongo from "@/app/(lib)/mongodb";
import Event from "@/app/(model)/Event";

// Conectar a MongoDB dentro de cada operación
async function connectDB() {
  await connectMongo();
}

// Manejo de la solicitud GET (Obtener un evento por ID)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event)
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// Manejo de la solicitud PATCH (Actualizar un evento)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json(); // Obtener los datos del cuerpo de la solicitud
    const updatedEvent = await Event.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedEvent)
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Manejo de la solicitud DELETE (Eliminar un evento)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedEvent = await Event.findByIdAndDelete(params.id);
    if (!deletedEvent)
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    );
  }
}
