import "./globals.css";

export const metadata = {
  title: "Project Still Here",
  description:
    "A wall where messages are left to support people living with illnesses."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
