'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
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
      <div
        id="sidebar-container"
        className={`fixed top-0 h-full z-40 flex items-center transition-all duration-500 ease-in-out ${
          isOpen ? 'left-0' : '-left-64'
        } xl:left-0`}
      >
        <div
          id="sidebar"
          className="w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl transform transition-transform duration-500 ease-in-out"
        >
          <div className="flex items-center justify-center h-20 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center">
              <img
                src="/appicon.png"
                alt="MyProducts Icon"
                className="h-16 w-16 -translate-x-2"
              />
              <h1 className="text-2xl font-bold tracking-wide text-white -translate-x-2">
                MyProducts
              </h1>
            </div>
          </div>

          <div className="flex items-center p-4 space-x-4 bg-gray-800 border-b border-gray-700">
            <img
              src={user?.profile_image || '/default-avatar.png'}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border border-gray-600"
            />
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">
                {user?.email || 'user@example.com'}
              </p>
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

        <button
          className="w-8 h-16 bg-gray-700 text-white flex items-center justify-center rounded-r-md shadow-sm cursor-pointer transform transition-transform duration-300 ease-in-out hover:bg-gray-600 xl:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="sidebar"
        >
          <span
            className={`transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            {isOpen ? '◀' : '▶'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out xl:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
