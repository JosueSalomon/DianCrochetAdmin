import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const lekton = localFont({
  src: "../public/fonts/Lekton-Bold.ttf",
  variable: "--lekton",
  weight: "bold",
});
const koulen = localFont({
  src: "../public/fonts/Koulen-Regular.ttf",
  variable: "--koulen",
  weight: "400",
});
const opensans = localFont({
  src: "../public/fonts/OpenSans.ttf",
  variable: "--opensans",
  weight: "400",
});
const opensansm = localFont({
  src: "../public/fonts/OpenSansMedium.ttf",
  variable: "--opensansm",
  weight: "medium",
});
const rubik = localFont({
  src: "../public/fonts/Rubik.ttf",
  variable: "--rubik",
  weight: "400",
});
const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  variable: "--inter",
  weight: "400",
});

const robotoMono = localFont({
  src: "../public/fonts/RobotoMono-VariableFont_wght.ttf",
  variable: "--robotoMono",
  weight: "400",
});

const roboto = localFont({
  src: "../public/fonts/Roboto-Light.ttf",
  variable: "--roboto",
  weight: "400",
});

const crimsom = localFont({
  src: "../public/fonts/CrimsonText-Regular.ttf",
  variable: "--crimsom",
  weight: "400",
});

export const metadata: Metadata = {
  title: "DianCrochetAdmin",
  description: "Pagina de administracion",
  icons: {
    icon: "/img/logo.svg", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${crimsom.variable}  ${robotoMono.variable} ${roboto.variable}  ${lekton.variable} ${koulen.variable} ${rubik.variable} ${opensans.variable} ${opensansm.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
