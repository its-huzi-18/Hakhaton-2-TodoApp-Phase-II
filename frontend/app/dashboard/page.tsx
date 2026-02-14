"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/auth";
import { useTasks } from "@/src/lib/tasks";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    toggleTaskComplete,
    deleteTask,
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchTasks();
  }, [isAuthenticated, fetchTasks, router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    await createTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      is_completed: false,
    });
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsCreating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
        Redirecting to login...
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-screen text-white">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

   

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Dashboard
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Tasks" value={tasks.length} color="indigo" />
          <StatCard
            title="Completed"
            value={tasks.filter((t) => t.is_completed).length}
            color="green"
          />
          <StatCard
            title="Pending"
            value={tasks.filter((t) => !t.is_completed).length}
            color="sky"
          />
        </div>

        {/* Create Task */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              className="w-full border border-white/20 bg-white/10 rounded-md px-3 py-2 text-white placeholder-slate-400"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isCreating}
            />
            <textarea
              placeholder="Task description (optional)"
              rows={3}
              className="w-full border border-white/20 bg-white/10 rounded-md px-3 py-2 text-white placeholder-slate-400"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
            >
              {isCreating ? "Creating..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-600/30 bg-red-600/10 text-red-400 p-4">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

          {isLoading ? (
            <p className="text-slate-300">Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-400">No tasks yet</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-start border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() =>
                        toggleTaskComplete(task.id, !task.is_completed)
                      }
                      className="mt-1 accent-sky-400"
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          task.is_completed
                            ? "line-through text-slate-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-slate-300">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* 🔹 Small reusable stat card */
function StatCard({
  title,
  value,
  color = "indigo",
}: {
  title: string;
  value: number;
  color?: "indigo" | "sky" | "green";
}) {
  const colorClasses = {
    indigo: "text-indigo-400",
    sky: "text-sky-400",
    green: "text-green-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg text-center">
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-slate-300 mt-1">{title}</div>
    </div>
  );
}
