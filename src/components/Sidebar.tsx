// src/components/Sidebar.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext)!;
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  const links = [
    { href: '/protected/tasks', label: 'Tasks' },
    { href: '/protected/profile', label: 'Profile' },
  ];

  const currentPath = usePathname();

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-xl font-bold">Trello Clone</h1>
      </div>
      <nav className="mt-10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block py-2.5 px-4 rounded transition duration-200 ${
              currentPath === link.href
                ? 'bg-gray-700'
                : 'hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
