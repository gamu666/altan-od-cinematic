import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans/wght.css";
import "@fontsource-variable/unbounded/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Алтан Заан Анар | Алтан Од Вьетнам гавар",
  description:
    "Алтан Заан Анар болон Алтан Од Вьетнам гаврын cinematic 3D танилцуулга.",
};

export const viewport: Viewport = {
  themeColor: "#090303",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
