'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext not found');
  }

  const { login } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login(email, password);
      router.push('/protected/dashboard');
    } catch (error) {
      setErrorMessage((error as Error).message || 'Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 space-y-6 border border-gray-700"
      >
        <div className="flex items-center justify-center h-20 bg-gray-900 border-b border-gray-700 rounded-lg -mx-8 -mt-8 mb-6">
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

        <h2 className="text-xl font-bold tracking-wide text-white">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-600 rounded-lg p-3 w-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-600 rounded-lg p-3 w-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="btn-primary"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-500 underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
