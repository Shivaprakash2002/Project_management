Project Management Frontend
This is the frontend for a Project Management Application, built with Next.js and Tailwind CSS. It provides a user interface for logging in, managing projects (view, create, update, delete), searching projects, and receiving real-time notifications. The frontend connects to an Express.js backend (separate repository) that uses MongoDB Atlas for cloud-hosted data storage.
Features

Login: Role-based authentication (Admin/Viewer).
Project Management:
Admins: Create, update, delete projects.
Viewers: View projects.


Search: Filter projects by name or description.
Notifications: Real-time updates for project changes with read/unread status.
Styling: Responsive design with Tailwind CSS.

Project Structure
project-management-frontend/
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind CSS styles
│   │   ├── layout.js         # Root layout with ToastContainer
│   │   ├── page.js           # Redirects to login
│   │   ├── login/
│   │   │   └── page.js       # Login form
│   │   ├── projects/
│   │   │   └── page.js       # Project list page
│   │   ├── project/
│   │   │   └── [id]/page.js  # Project create/edit form
│   ├── components/
│   │   ├── ProjectList.js    # Project list with search and notifications
│   │   ├── ProjectForm.js    # Form for creating/editing projects
│   │   └── Notification.js   # Notification display
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md

Database Explanation
The frontend does not directly interact with the database; it communicates with the backend via APIs and Socket.IO. The backend uses MongoDB Atlas, a cloud-hosted NoSQL database, to store:

Users: Authentication data (username, password, role).
Projects: Project details (name, description, creation date).
Notifications: Messages about project changes (linked to users).

Role of MongoDB Atlas

Cloud-Hosted: Allows team members to access the app without local database setup, unlike PostgreSQL.
Data Storage: Stores JSON-like documents, making it flexible for project data.
Backend Integration: The backend (project-management-backend) connects to MongoDB Atlas using a connection string, serving data to the frontend.

Accessing the Database

Your manager can view the database using MongoDB Compass with the backend’s MONGO_URI (see backend README).
Alternatively, create a read-only user for inspection:
Run in the backend:const { createUser } = require('./models/User');
await createUser('readonly', 'readonlypassword', 'Viewer');


Connection string: mongodb+srv://readonly:readonlypassword@cluster0.abcdef.mongodb.net/project_management



Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)
Backend Repository (running or deployed, see project-management-backend)
Git (for cloning and deployment)
Render or Vercel account (for deployment, render.com or vercel.com)

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/project-management-frontend.git
cd project-management-frontend

2. Install Dependencies
npm install

3. Configure Backend Connection

Ensure the backend is running or deployed:
Local: http://localhost:5000 (default backend port).
Deployed: E.g., https://project-management-backend.onrender.com.


Update API and Socket.IO URLs in:
src/app/login/page.js
src/components/ProjectList.js
src/components/ProjectForm.js


For local testing:const response = await axios.post('http://localhost:5000/api/auth/login', { ... });
const socket = io('http://localhost:5000');


For deployment, use the backend URL:const response = await axios.post('https://project-management-backend.onrender.com/api/auth/login', { ... });
const socket = io('https://project-management-backend.onrender.com');



4. Start the Frontend
npm run dev


Access at http://localhost:3000.

5. Test the Application

Log in with:
Admin: Username: admin, Password: password, Role: Admin
Viewer: Username: viewer, Password: password, Role: Viewer


Test:
Login and role-based access.
Project CRUD (Admin only).
Search projects.
Real-time notifications.



Deployment (Render)

Update API URLs:

Set backend URL to the deployed backend (e.g., https://project-management-backend.onrender.com).


Push to GitHub:
git add .
git commit -m "Initial frontend commit"
git push origin main


Create a Web Service:

Sign up/log in at render.com.
Click + New > Web Service.
Connect your GitHub repository.
Configure:
Name: project-management-frontend
Environment: Node
Branch: main
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free


Click Create Web Service.


Verify:

Get the URL (e.g., https://project-management-frontend.onrender.com).
Test login, project management, and notifications.



Deployment (Vercel, Recommended)

Push to GitHub (as above).
Import to Vercel:
Sign up/log in at vercel.com.
Click + New Project > Import Git Repository.
Connect the repository.


Configure:
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Environment Variables: None needed


Deploy:
Get the URL (e.g., https://your-project.vercel.app).
Update backend server.js CORS:const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://your-project.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-project.vercel.app'],
}));





Troubleshooting

API Connection Errors:
Ensure backend is running (http://localhost:5000 or deployed URL).
Verify API URLs in frontend code.


Socket.IO Issues:
Check Socket.IO URL in ProjectList.js.
Ensure backend CORS allows the frontend URL.


Login Issues:
Confirm backend has seeded users (admin, viewer).
Check JWT token in API responses.



How It Works

Routing: Next.js file-based routing (app/) for login (/login), project list (/projects), and project form (/project/[id]).
Components:
ProjectList.js: Displays projects, search bar, and notifications; connects to Socket.IO for real-time updates.
ProjectForm.js: Form for creating/editing projects (Admin only).
Notification.js: Shows notifications with read/unread status.


Backend Dependency: Communicates with the backend via Axios (API calls) and Socket.IO (real-time).
Styling: Tailwind CSS for responsive, modern UI.

