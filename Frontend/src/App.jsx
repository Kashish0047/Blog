import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Post from './pages/Post';
import Profile from './pages/Profile';
import AdminLayout from './Layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Allpost from './pages/Admin/Allpost';
import Addpost from './pages/Admin/Addpost';
import Editpost from './pages/Admin/EditPost';
import User from './pages/Admin/User';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCheck from './components/AuthCheck';
import './index.css';

// Layout component for user routes
const UserLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </>
);

// Layout component for post page without navbar and footer
const PostLayout = () => (
  <main className="flex-grow-1">
    <Outlet />
  </main>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthCheck />
        <div className="d-flex flex-column min-vh-100">
        <Routes>
            {/* Public Routes */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Post Page */}
            <Route element={<PostLayout />}>
              <Route path="/post/:id" element={<Post />} />
            </Route>

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/allpost" element={<Allpost />} />
                <Route path="/admin/addpost" element={<Addpost />} />
                <Route path="/admin/editpost/:id" element={<Editpost />} />
                <Route path="/admin/users" element={<User />} />
             </Route>
           </Route>

            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
