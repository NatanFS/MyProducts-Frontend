import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'MyProducts',
  description: 'Inventory management system for small businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="md:bg-gradient-to-r md:from-gray-800 md:to-gray-900 min-h-screen bg-gray-800 ">
        <Providers >
          {children}
        </Providers>
      </body>
    </html>
  );
}
