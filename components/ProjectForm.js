'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProjectForm({ id }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      alert('Failed to fetch project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert('All fields are required');
      return;
    }

    try {
      if (id && id !== 'new') {
        await axios.put(
          `http://localhost:5000/api/projects/${id}`,
          { name, description },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/projects',
          { name, description },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }
      router.push('/projects');
    } catch (error) {
      alert('Failed to save project');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">{id && id !== 'new' ? 'Edit Project' : 'Add Project'}</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        ></textarea>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}