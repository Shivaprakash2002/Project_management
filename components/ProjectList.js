'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import Notification from './Notification';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      console.warn('No userId found in localStorage!');
      return; // Prevent socket from emitting with undefined
    }
  
    socket.emit('join', { userId });
  
    socket.on('projectCreated', (project) => {
      setProjects((prev) => [...prev, project]);
      toast.info(`Project ${project.name} created`);
    });
  
    socket.on('projectUpdated', (project) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
      toast.info(`Project ${project.name} updated`);
    });
  
    socket.on('projectDeleted', ({ id }) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.info('Project deleted');
    });
  
    socket.on('notifications', (notifs) => {
      console.log('Received notifications:', notifs);
      setNotifications(notifs);
    });
  
    return () => {
      socket.off('projectCreated');
      socket.off('projectUpdated');
      socket.off('projectDeleted');
      socket.off('notifications');
    };
  }, []);
  

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects?search=${search}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // The socket event will handle the removal from the list
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Disconnect socket
    socket.disconnect();
    
    // Redirect to login page
    toast.info('Logged out successfully');
    router.push('/auth/sign-in');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Projects</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && fetchProjects()}
        />
        {role === 'Admin' && (
          <button
            onClick={() => router.push('/project/new')}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Add Project
          </button>
        )}
      </div>
      
      <Notification notifications={notifications} socket={socket} />
      
      <div className="grid gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl">{project.name}</h3>
              <p>{project.description}</p>
              {role === 'Admin' && (
                <div className="mt-2">
                  <button
                    onClick={() => router.push(`/project/${project._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No projects found. {role === 'Admin' && "Click 'Add Project' to create one."}
          </div>
        )}
      </div>
    </div>
  );
}