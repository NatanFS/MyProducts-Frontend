import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Trello Clone',
  description: 'A clone of Trello application',
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
