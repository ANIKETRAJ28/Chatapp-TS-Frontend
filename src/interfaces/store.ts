import { IUser } from './user';

export interface IStore {
  id: string | null;
  name: string | null;
  email: string | null;
  username: string | null;
  avatar: string | null;
  setUser: (user: IUser) => void;
  reset: () => void;
}
