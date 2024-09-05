import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Import Tailwind CSS

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingUserId) {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUserId}`, formData);
        setUsers(users.map((user) => (user.id === editingUserId ? { ...user, ...formData } : user)));
        setIsEditing(false);
        setEditingUserId(null);
      } else {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers([...users, { ...response.data, id: users.length + 1 }]);
      }
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setIsEditing(true);
    setEditingUserId(user.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="container mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen min-w-full text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">User Management</h1>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-800 dark:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit User' : 'Create User'}</h2>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </form>

        {/* Users List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
              <h3 className="text-lg font-bold mb-2">{user.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">Email: {user.email}</p>
              <p className="text-gray-700 dark:text-gray-300">Phone: {user.phone}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
