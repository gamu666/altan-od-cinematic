import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans/wght.css";
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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <head>
        <link
          rel="preload"
          href={`${basePath}/models/golden-star-balm.glb?v=5`}
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
