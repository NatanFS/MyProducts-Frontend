// src/app/layout.tsx

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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
