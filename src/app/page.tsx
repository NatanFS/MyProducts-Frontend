'use client';

import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext?.user) {
      router.push('/protected/products');
    } else {
      router.push('/login');
    }
  }, [authContext, router]);

  return null;
}
