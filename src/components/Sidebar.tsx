'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext)!;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (!user) {
    return null;
  }

  const links = [
    { href: '/protected/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/protected/products', label: 'Products', icon: '📦' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg lg:hidden transition-transform duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          ☰
        </span>
      </button>

      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-gray-950 shadow-xl transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:translate-x-0`}
      >
        <div className="flex items-center justify-center h-20 bg-gray-900 border-b border-gray-700">
          <h1 className="text-2xl font-bold tracking-wide">MyProducts</h1>
        </div>

        <div className="flex items-center p-4 space-x-4 bg-gray-800 border-b border-gray-700">
          <img
            src={user?.profile_image || '/default-avatar.png'}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border border-gray-600"
          />
          <div>
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <nav className="mt-4 space-y-2">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className={`flex items-center py-3 px-4 rounded-lg transition ml-2 mr-2 duration-200 w-full text-left ${
                currentPath === link.href
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span className="mr-4">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
