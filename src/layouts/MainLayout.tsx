import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import useAuthStore from '../store/authStore';
import { auth } from '../apis/auth';

export default function Layout({ children }: { children: React.ReactElement }) {
  const authStore = useAuthStore();

  const setUserToStore = async () => {
    const user = await auth();
    if (!user) {
      return;
    }
    authStore.setUser({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  };

  useEffect(() => {
    setUserToStore();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="">{children}</div>
    </div>
  );
}
