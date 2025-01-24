import { IUser } from './user';

export interface ICommunity {
  id: string;
  name: string;
  avatar: string;
  type: 'group' | 'friend';
  users: number;
  description?: string;
}

export interface IGroupCommunity {
  id: string;
  name: string;
  description: string | null;
  avatar: string;
  type: 'group';
  users: number;
}

export interface IFriendCommunity {
  id: string;
  type: 'friend';
  friend: IUser;
  users: number;
}
