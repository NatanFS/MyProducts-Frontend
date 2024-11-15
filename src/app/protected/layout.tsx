// src/app/protected/layout.tsx

'use client';

import { AuthProvider, AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  if (!user) {
    // Redirect to login if not authenticated
    router.push('/login');
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
