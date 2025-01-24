import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Layout from '../layouts/MainLayout';
import ChatPage from '../pages/ChatPage';
import Auth from '../pages/Auth';
import ProtectedRoute from './ProtectedRoutes';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout children={<LandingPage />} />} />
      <Route path="/chat" element={<Layout children={<ProtectedRoute component={ChatPage} />} />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
    </Routes>
  );
}
