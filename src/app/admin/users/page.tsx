'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

interface User {
  _id: string;
  firstName: string;
  email: string;
  role: 'user' | 'admin' | string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/user`);
        if (!res.ok) throw new Error('Failed to fetch users');

        const json = await res.json();
        setUsers(Array.isArray(json) ? json : json?.data || []);
      } catch (err: any) {
        toast.error(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Role update failed');

      const result = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: result.user.role } : u))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="hidden md:table-cell px-4 py-3">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-300 rounded w-36"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-6 container max-w-6xl mx-auto 2xl:mt-5 pb-20">
      <h1 className="text-2xl  mb-6 text-gray-800">Users List</h1>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium uppercase text-sm hidden lg:table-cell">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium uppercase text-sm">Email</th>
              <th className="px-4 py-3 text-left text-white font-medium uppercase text-sm">Role</th>
              <th className="px-4 py-3 text-left text-white font-medium uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800 hidden lg:block">{user.firstName}</td>
                    <td className="px-4 py-3 text-gray-800 break-all">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded border ${
                          user.role === 'admin'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-800 border-gray-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2 flex-wrap">
                      <select
                        value={user.role}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        aria-label="Role"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        aria-label="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg shadow animate-pulse space-y-2"
              >
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            ))
          : users.map((user) => (
              <div
                key={user._id}
                className="p-4 border rounded-lg shadow space-y-2"
              >
                <p className="font-semibold text-gray-800">{user.firstName}</p>
                <p className="text-gray-700 break-all">{user.email}</p>
                <p>
                  <span
                    className={`px-2 py-1 text-sm font-semibold rounded border ${
                      user.role === 'admin'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-800 border-gray-400'
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <select
                    value={user.role}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {!isLoading && users.length === 0 && (
        <p className="text-center mt-6 text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default Users;
