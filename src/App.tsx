import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Import Tailwind CSS styles

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const App: React.FC = () => {
  // State to hold the list of users
  const [users, setUsers] = useState<User[]>([]);

  // State to hold form data for creating or editing users
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // State to check if the form is in "edit" mode
  const [isEditing, setIsEditing] = useState(false);

  // Store the ID of the user being edited
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // State to toggle between dark and light modes
  const [darkMode, setDarkMode] = useState(false); 

  // Fetch the list of users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from the JSONPlaceholder API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data); // Set the fetched users in the state
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data dynamically
  };

  // Handle form submission for creating or updating a user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If editing, perform a PUT request to update the user
      if (isEditing && editingUserId) {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUserId}`, formData);
        setUsers(users.map((user) => (user.id === editingUserId ? { ...user, ...formData } : user)));
        setIsEditing(false);
        setEditingUserId(null); // Reset after editing
      } else {
        // If creating a new user, perform a POST request
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers([...users, { ...response.data, id: users.length + 1 }]); // Add new user locally
      }
      setFormData({ name: '', email: '', phone: '' }); // Reset form data after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to fill the form with the selected user's data for editing
  const handleEdit = (user: User) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setIsEditing(true);
    setEditingUserId(user.id); // Store the user ID being edited
  };

  // Function to delete a user by sending a DELETE request
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Remove user from state
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Invert the dark mode state
  };

  return (
    // Apply dark mode class conditionally based on state
    <div className={darkMode ? 'dark' : ''}> 
      <div className="container mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen min-w-full text-gray-900 dark:text-gray-100">
        
        {/* Header section with a Dark Mode toggle button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">User Management</h1>
          {/* Button to toggle between dark and light modes */}
          <button
            onClick={toggleDarkMode}
            className="bg-gray-800 dark:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Form for creating or editing a user */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-6 max-w-md mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit User' : 'Create User'}</h2>
          
          {/* Name Input Field */}
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

          {/* Email Input Field */}
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

          {/* Phone Input Field */}
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

          {/* Submit button for creating or updating a user */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </form>

        {/* Users List - Display users in a grid using Tailwind */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
              {/* User details */}
              <h3 className="text-lg font-bold mb-2">{user.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">Email: {user.email}</p>
              <p className="text-gray-700 dark:text-gray-300">Phone: {user.phone}</p>

              {/* Edit and Delete buttons */}
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
