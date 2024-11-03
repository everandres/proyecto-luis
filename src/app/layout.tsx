import { Roboto } from "next/font/google";
import "./globals.css";
import { EventProvider } from "@/app/context/eventcontext";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <EventProvider>{children}</EventProvider>
      </body>
    </html>
  );
}
