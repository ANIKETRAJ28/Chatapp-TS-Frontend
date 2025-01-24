import { MessageCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { logout } from '../apis/auth';

export default function NavBar() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 sticky top-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold">AniChat</span>
        </div>

        <div className="flex items-center space-x-3">
          {authStore.name && authStore.avatar ? (
            <>
              <img src={authStore.avatar} alt={authStore.name} className="w-8 h-8 rounded-full" />
              <span>{authStore.name}</span>
              <button
                onClick={async () => {
                  await logout();
                  authStore.reset();
                }}
                className="py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
