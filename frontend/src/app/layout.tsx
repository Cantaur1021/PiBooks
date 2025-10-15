import "./globals.css";
import { Shell } from "./components/shell";

export const metadata = { title: "AccBooks" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
