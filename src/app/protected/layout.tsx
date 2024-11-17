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
    setTimeout(() => {
        router.push('/login');
    }, 0);
    return null;
  }

  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 xl:pl-64 flex items-center justify-center">
        <div className="w-full max-w-[1960px] mx-auto">
        {children}
        </div>
    </main>
    </div>

  );
}
