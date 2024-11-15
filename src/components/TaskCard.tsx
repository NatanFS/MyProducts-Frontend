interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
  }
  
  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
        <p className="mb-2">{task.description}</p>
        <p className="text-sm text-gray-500">Status: {task.status}</p>
      </div>
    );
  };
  
  export default TaskCard;
  