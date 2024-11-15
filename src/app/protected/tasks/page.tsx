// src/app/protected/tasks/page.tsx

'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import apiFetch from '../../../utils/api';
import TaskCard from '../../../components/TaskCard';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function TasksPage() {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const fetchTasks = async () => {
        try {
          const data = await apiFetch('/tasks/');
          setTasks(data);
        } catch (error) {
          console.error('Failed to fetch tasks', error);
        }
      };
      fetchTasks();
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Welcome, {user.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
