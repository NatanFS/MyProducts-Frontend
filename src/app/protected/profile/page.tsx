'use client';

import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext)!;

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
