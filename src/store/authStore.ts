import { IUser } from '../interfaces/user';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IStore } from '../interfaces/store';

const authStore = (
  set: (partial: IUser | ((state: IUser) => void)) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _get: () => IStore,
): IStore => ({
  id: null,
  name: null,
  email: null,
  username: null,
  avatar: null,

  setUser: (user: IUser) => {
    set(() => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      username: user.username,
    }));
  },
  reset: () => {
    set(() => ({
      id: null,
      name: null,
      username: null,
      avatar: null,
      email: null,
    }));
  },
});

const useAuthStore = create<IStore>()(devtools(persist(authStore, { name: 'auth' })));

export default useAuthStore;
