'use client';

import { useState } from 'react';
import apiFetch from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      await apiFetch('/users/', {
        method: 'POST',
        body: formData,
      });

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: { field: string; message: string }) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
      } else if (error.detail) {
        setGlobalError(error.detail);
      } else {
        setGlobalError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
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

        {globalError && (
          <p className="text-red-500 text-sm text-center">{globalError}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-sm text-center">{successMessage}</p>
        )}

        <div className="flex justify-center mb-4">
          <label
            htmlFor="profileImage"
            className="cursor-pointer relative w-32 h-32 rounded-full border-4 border-gray-600 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition duration-200"
          >
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-400 text-center">Upload profile image</span>
            )}
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="flex justify-center">
          {fieldErrors.profile_image && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.profile_image}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Name"
            className={`border p-3 w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className={`border p-3 w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className={`border p-3 w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className={`border p-3 w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.confirmPassword
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 w-full rounded-lg shadow-lg transition duration-300 ease-in-out"
        >
          Register
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-500 underline"
            >
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
