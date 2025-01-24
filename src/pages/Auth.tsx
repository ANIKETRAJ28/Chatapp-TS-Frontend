import { useState } from 'react';
import { User, Mail, Lock, UserCircle } from 'lucide-react';
import { IAuth } from '../interfaces/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../apis/auth';
import { signup } from '../apis/auth';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<IAuth>({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const authType = location.pathname.split('/')[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      if (authType === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 pt-4 pb-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {authType === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {authType === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authType !== 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline-block mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  value={formData.name as string}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserCircle className="w-4 h-4 inline-block mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="johndoe123"
                  value={formData.username as string}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline-block mr-2" />
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline-block mr-2" />
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {authType === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {authType === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              if (authType === 'login') navigate('/signup');
              else navigate('/login');
            }}
            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {authType === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
