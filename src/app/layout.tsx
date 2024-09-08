import { Inter } from "next/font/google";
import "./globals.css";
import { EventProvider } from "@/app/context/eventcontext"; // Asegúrate de importar el EventProvider

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EventProvider>
          {children} {/* Los children estarán envueltos por el EventProvider */}
        </EventProvider>
      </body>
    </html>
  );
}
